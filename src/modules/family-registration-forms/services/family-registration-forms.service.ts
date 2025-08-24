import { FamilyMembersService } from '../../family-members/services/family-members.service';
import { GuardiansService } from '../../guardians/services/guardians.service';
import { HousesService } from '../../houses/services/houses.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOneOptions, Repository } from 'typeorm';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { paginate } from '../../../common/pagination/paginate.service';
import { FamiliesService } from '../../families/services/families.service';
import { FamilyRegistrationFormFilterDto } from '../dtos/queries/family-registration-form-filter.dto';
import { CreateFamilyRegistrationFormDto } from '../dtos/requests/create-family-registration-form.dto';
import { UpdateFamilyRegistrationFormDto } from '../dtos/requests/update-family-registration-form.dto';
import { FamilyRegistrationFormResponseDto } from '../dtos/responses/family-registration-form-response.dto';
import { FamilyRegistrationForm } from '../entities/family-registration-form.entity';
@Injectable()
export class FamilyRegistrationFormsService {
  constructor(
    @InjectRepository(FamilyRegistrationForm)
    private readonly familyRegistrationFormRepository: Repository<FamilyRegistrationForm>,
    private readonly familyService: FamiliesService,
    private readonly guardianService: GuardiansService,
    private readonly houseService: HousesService,
    private readonly familyMemberService: FamilyMembersService,
  ) {}

  async create(createDto: CreateFamilyRegistrationFormDto): Promise<FamilyRegistrationForm> {
    return await this.familyRegistrationFormRepository.manager.transaction(
      async (entityManager) => {
        // create and save the family registration form
        const form = entityManager.create(FamilyRegistrationForm, {
          ...createDto,
        });

        const savedForm = await entityManager.save(form);

        // create guardian
        const guardian = await this.guardianService.create(createDto.guardians, entityManager);

        // create family
        const family = await this.familyService.create(
          {
            ...createDto.family,
            guardianId: guardian.id,
            registrationFormId: savedForm.id,
          },
          entityManager,
        );

        // create family members
        const familyMembersPromises = createDto.familyMembers.map((member) =>
          this.familyMemberService.create(
            {
              ...member,
              familyId: family.id,
            },
            entityManager,
          ),
        );

        // create house
        await this.houseService.create(
          {
            ...createDto.house,
            familyId: family.id,
          },
          entityManager,
        );

        await Promise.all(familyMembersPromises);

        return this.findOne(
          savedForm.id,
          {
            relations: ['family', 'family.guardian', 'family.houses', 'family.familyMembers'],
          },
          entityManager,
        );
      },
    );
  }

  async findAll(
    filter: FamilyRegistrationFormFilterDto,
  ): Promise<PaginationResponseDto<FamilyRegistrationFormResponseDto>> {
    const queryBuilder = this.familyRegistrationFormRepository
      .createQueryBuilder('form')
      .leftJoinAndSelect('form.family', 'family');

    if (filter.search) {
      queryBuilder.andWhere(
        '(form.formNotes LIKE :search OR form.managementDecision LIKE :search OR family.familyName LIKE :search)',
        { search: `%${filter.search}%` },
      );
    }

    if (filter.requestStatus) {
      queryBuilder.andWhere('form.requestStatus = :requestStatus', {
        requestStatus: filter.requestStatus,
      });
    }

    return paginate(queryBuilder, filter, FamilyRegistrationFormResponseDto);
  }

  async findOne(
    id: number,
    options: FindOneOptions<FamilyRegistrationForm> = {},
    entityManager?: EntityManager,
  ): Promise<FamilyRegistrationForm> {
    const formRepository =
      entityManager?.getRepository(FamilyRegistrationForm) ?? this.familyRegistrationFormRepository;

    const form = await formRepository.findOne({
      where: { id },
      relations: options.relations,
    });

    if (!form) {
      throw new NotFoundException('Family registration form not found');
    }

    return form;
  }

  async update(
    id: number,
    updateDto: UpdateFamilyRegistrationFormDto,
  ): Promise<FamilyRegistrationForm> {
    const form = await this.familyRegistrationFormRepository.findOneById(id);

    if (!form) {
      throw new NotFoundException('Family registration form not found');
    }

    const updatedForm = this.familyRegistrationFormRepository.merge(form, updateDto);
    return this.familyRegistrationFormRepository.save(updatedForm);
  }

  async delete(id: number): Promise<void> {
    const result = await this.familyRegistrationFormRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException('Family registration form not found');
    }
  }
}
