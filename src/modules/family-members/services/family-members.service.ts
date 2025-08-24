import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOneOptions, Repository } from 'typeorm';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { paginate } from '../../../common/pagination/paginate.service';
import { FamiliesService } from '../../../modules/families/services/families.service';
import { Person } from '../../../modules/persons/entities/person.entity';
import { GenderType } from '../../../modules/persons/enums/gender-type.enum';
import { PersonRelation } from '../../../modules/persons/enums/person-relation.enum';
import { PersonsService } from '../../../modules/persons/services/persons.service';
import { applyPersonFilters } from '../../persons/utils/person-filter.util';
import { FamilyMemberFilterDto } from '../dtos/queries/family-member-filter.dto';
import { CreateFamilyMemberDto } from '../dtos/requests/create-family-member.dto';
import { UpdateFamilyMemberDto } from '../dtos/requests/update-family-member.dto';
import { FamilyMemberResponseDto } from '../dtos/responses/family-member-response.dto';
import { FamilyMember } from '../entities/family-members.entity';
import { FamilyRelationType } from '../enums/family-relation-type.enum';
import { applyFamilyMemberFilters } from '../utils';

@Injectable()
export class FamilyMembersService {
  constructor(
    @InjectRepository(FamilyMember)
    private readonly familyMemberRepository: Repository<FamilyMember>,
    private readonly familiesService: FamiliesService,
    private readonly personsService: PersonsService,
  ) {}

  async create(
    createFamilyMemberDto: CreateFamilyMemberDto,
    entityManager?: EntityManager,
  ): Promise<FamilyMember> {
    const repo = entityManager?.getRepository(FamilyMember) ?? this.familyMemberRepository;

    if (entityManager) {
      return this.createFamilyMemberInternal(createFamilyMemberDto, entityManager);
    } else {
      return repo.manager.transaction(async (em) => {
        return this.createFamilyMemberInternal(createFamilyMemberDto, em);
      });
    }
  }

  private async createFamilyMemberInternal(
    createFamilyMemberDto: CreateFamilyMemberDto,
    em: EntityManager,
  ): Promise<FamilyMember> {
    await this.familiesService.findOne(createFamilyMemberDto.familyId, {}, em);

    let person: Person;

    if (createFamilyMemberDto.personId) {
      const foundPerson = await this.personsService.findOne(
        createFamilyMemberDto.personId,
        { relations: ['familyMember'] },
        em,
      );

      if (foundPerson.familyMember) {
        throw new ConflictException('Person is already a member of a family');
      }
      person = foundPerson;
    } else {
      person = await this.personsService.create(createFamilyMemberDto.person, em);
    }

    if (createFamilyMemberDto.relationType === FamilyRelationType.FATHER) {
      const member = await em.findOne(FamilyMember, {
        where: {
          familyId: createFamilyMemberDto.familyId,
          relationType: FamilyRelationType.FATHER,
        },
      });
      if (member) {
        throw new ConflictException('The family already has a father');
      }
    }

    await this.validateGenderRelationType(person.gender, createFamilyMemberDto.relationType);

    if (createFamilyMemberDto.isSponsored) {
      const relation = createFamilyMemberDto.relationType;
      if (relation !== FamilyRelationType.DAUGHTER && relation !== FamilyRelationType.SON) {
        throw new ConflictException('Only daughters and sons can be sponsored');
      }
    }

    const entity = this.familyMemberRepository.create({
      ...createFamilyMemberDto,
      person: person,
    });

    return await em.save(FamilyMember, entity);
  }

  async findAll(
    filterDto: FamilyMemberFilterDto,
  ): Promise<PaginationResponseDto<FamilyMemberResponseDto>> {
    const qb = this.familyMemberRepository
      .createQueryBuilder('family_member')
      .leftJoinAndSelect('family_member.person', 'person')
      .leftJoinAndSelect('family_member.family', 'family')
      // join active sponsorships and map its supporter as currentSponsor on the root entity
      .leftJoinAndSelect(
        'family_member.childSponsorships',
        'childSponsorships',
        'childSponsorships.sponsorshipStatus = :activeStatus',
        { activeStatus: 'active' },
      )
      .leftJoinAndSelect('childSponsorships.supporter', 'supporter')
      .leftJoinAndSelect('supporter.person', 'supporterPerson');

    // Apply family member filters
    applyFamilyMemberFilters(qb, 'family_member', filterDto);
    // Apply person filters
    if (filterDto.person) {
      applyPersonFilters(qb, 'person', filterDto.person);
    }

    return paginate(qb, filterDto, FamilyMemberResponseDto);
  }

  async findOne(id: number, options: FindOneOptions<FamilyMember> = {}): Promise<FamilyMember> {
    const familyMember = await this.familyMemberRepository.findOne({
      where: { id },
      ...options,
    });
    if (!familyMember) {
      throw new NotFoundException('Family member not found');
    }
    return familyMember;
  }

  async findOneDetailed(id: number): Promise<FamilyMember> {
    // Use query builder to include current active sponsor relations only
    const familyMember = await this.familyMemberRepository
      .createQueryBuilder('family_member')
      .leftJoinAndSelect('family_member.person', 'person')
      .leftJoinAndSelect('family_member.family', 'family')
      .leftJoinAndSelect(
        'family_member.childSponsorships',
        'childSponsorships',
        'childSponsorships.sponsorshipStatus = :activeStatus',
        { activeStatus: 'active' },
      )
      .leftJoinAndSelect('childSponsorships.supporter', 'supporter')
      .leftJoinAndSelect('supporter.person', 'supporterPerson')
      .where('family_member.id = :id', { id })
      .getOne();

    if (!familyMember) {
      throw new NotFoundException(`Family member with ID ${id} not found`);
    }
    return familyMember;
  }

  async update(id: number, updateData: UpdateFamilyMemberDto): Promise<FamilyMember> {
    return await this.familyMemberRepository.manager.transaction(async (entityManager) => {
      const familyMember = await this.findOneDetailed(id);

      if (
        updateData.relationType &&
        updateData.relationType !== familyMember.relationType &&
        familyMember?.childSponsorships?.length > 0
      ) {
        throw new ConflictException(
          'Cannot change relation type because the member has existing child sponsorships.',
        );
      }

      // new relationType is Father => check if have already father
      if (
        updateData.relationType === FamilyRelationType.FATHER &&
        familyMember.relationType != updateData.relationType
      ) {
        const existingFather = await entityManager.getRepository(FamilyMember).exists({
          where: {
            familyId: familyMember.familyId,
            relationType: FamilyRelationType.FATHER,
          },
        });
        if (existingFather) {
          throw new ConflictException('The family already has a father');
        }
      }

      // check if relationType match gender
      const relationType = updateData.relationType ?? familyMember.relationType;
      const gender = updateData?.person?.gender ?? familyMember?.person?.gender;
      const isSponsored = updateData?.isSponsored ?? familyMember?.isSponsored;

      await this.validateGenderRelationType(gender, relationType);

      //
      if (isSponsored) {
        const relation = updateData.relationType;
        if (relation !== FamilyRelationType.DAUGHTER && relation !== FamilyRelationType.SON) {
          throw new ConflictException('Only daughters and sons can be sponsored');
        }
      }

      if (updateData.person) {
        familyMember.person = await this.personsService.update(
          familyMember.person.id,
          updateData.person,
        );
        delete updateData.person;
      }

      entityManager.getRepository(FamilyMember).merge(familyMember, updateData);
      return await entityManager.getRepository(FamilyMember).save(familyMember);
    });
  }

  async delete(id: number): Promise<void> {
    const familyMember = await this.findOne(id);
    await this.familyMemberRepository.delete(id);
    await this.personsService.deleteIf(familyMember.personId, PersonRelation.FAMILY_MEMBER);
  }

  // private methods

  private async validateGenderRelationType(
    gender: GenderType,
    relationType: FamilyRelationType,
  ): Promise<void> {
    const expectedGenderByRelation: Record<FamilyRelationType, GenderType | undefined> = {
      [FamilyRelationType.FATHER]: GenderType.MALE,
      [FamilyRelationType.MOTHER]: GenderType.FEMALE,
      [FamilyRelationType.SON]: GenderType.MALE,
      [FamilyRelationType.DAUGHTER]: GenderType.FEMALE,
      [FamilyRelationType.PATERNAL_UNCLE]: GenderType.MALE,
      [FamilyRelationType.PATERNAL_AUNT]: GenderType.FEMALE,
      [FamilyRelationType.MATERNAL_UNCLE]: GenderType.MALE,
      [FamilyRelationType.MATERNAL_AUNT]: GenderType.FEMALE,
      [FamilyRelationType.PATERNAL_GRANDFATHER]: GenderType.MALE,
      [FamilyRelationType.MATERNAL_GRANDFATHER]: GenderType.MALE,
      [FamilyRelationType.PATERNAL_GRANDMOTHER]: GenderType.FEMALE,
      [FamilyRelationType.MATERNAL_GRANDMOTHER]: GenderType.FEMALE,
      [FamilyRelationType.OTHER]: undefined,
    };

    const expectedGender = expectedGenderByRelation[relationType];

    if (expectedGender && expectedGender !== gender) {
      throw new ConflictException('Person gender does not match the selected family relation type');
    }
  }
}
