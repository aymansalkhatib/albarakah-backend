import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { FamilyMember } from '../entities/family-members.entity';
import { FamilyRelationType } from '../enums/family-relation-type.enum';
import { CreateFamilyMemberDto } from '../dtos/requests/create-family-member.dto';
import { FamiliesService } from '@app/modules/families/services/families.service';
import { paginate } from '@app/common/pagination/paginate.service';
import { PaginationDto } from '@app/common/pagination/dto/pagination.dto';
import { FamilyMemberResponseDto } from '../dtos/responses/family-member-response.dto';
import { PaginationResponseDto } from '@app/common/pagination/dto/pagination-response.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonsService } from '@app/modules/persons/services/persons.service';
import { GenderType } from '@app/modules/persons/enums/gender-type.enum';
import { FamilyMemberFilterDto } from '../dtos/queries/family-member-filter.dto';
import { Person } from '@app/modules/persons/entities/person.entity';
import { PersonRelation } from '@app/modules/persons/enums/person-relation.enum';
import { UpdateFamilyMemberDto } from '../dtos/requests/update-family-member.dto';

@Injectable()
export class FamilyMembersService {
  constructor(
    @InjectRepository(FamilyMember)
    private readonly familyMemberRepository: Repository<FamilyMember>,
    private readonly familiesService: FamiliesService,
    private readonly personsService: PersonsService,
  ) {}

  async create(createFamilyMemberDto: CreateFamilyMemberDto): Promise<FamilyMember> {
    return await this.familyMemberRepository.manager.transaction(async (entityManager) => {
      await this.familiesService.findOne(createFamilyMemberDto.familyId);

      let person: Person;

      if (createFamilyMemberDto.personId) {
        const foundPerson = await this.personsService.findOne(createFamilyMemberDto.personId, {
          relations: ['familyMember'],
        });

        if (foundPerson.familyMember) {
          throw new ConflictException('Person is already a member of a family');
        }
        person = foundPerson;
      } else {
        person = await this.personsService.createWithTransaction(
          createFamilyMemberDto.person,
          entityManager,
        );
      }

      if (createFamilyMemberDto.relationType === FamilyRelationType.FATHER) {
        const member = await entityManager.findOne(FamilyMember, {
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

      return await entityManager.save(FamilyMember, entity);
    });
  }

  async findAll(
    filterDto: FamilyMemberFilterDto,
  ): Promise<PaginationResponseDto<FamilyMemberResponseDto>> {
    const qb = this.familyMemberRepository
      .createQueryBuilder('family_member')
      .leftJoinAndSelect('family_member.person', 'person')
      .leftJoinAndSelect('family_member.family', 'family');

    if (filterDto.familyId) {
      qb.andWhere('family_member.familyId = :familyId', { familyId: filterDto.familyId });
    }
    if (filterDto.personId) {
      qb.andWhere('family_member.personId = :personId', { personId: filterDto.personId });
    }
    if (filterDto.relationType) {
      qb.andWhere('family_member.relationType = :relationType', {
        relationType: filterDto.relationType,
      });
    }
    if (filterDto.isSponsored !== undefined) {
      qb.andWhere('family_member.isSponsored = :isSponsored', {
        isSponsored: filterDto.isSponsored,
      });
    }
    if (filterDto.person) {
      if (filterDto.person.firstName) {
        qb.andWhere('person.firstName ILIKE :firstName', {
          firstName: `%${filterDto.person.firstName}%`,
        });
      }

      if (filterDto.person.lastName) {
        qb.andWhere('person.lastName ILIKE :lastName', {
          lastName: `%${filterDto.person.lastName}%`,
        });
      }

      if (filterDto.person.nationalId) {
        qb.andWhere('person.nationalId LIKE :nationalId', {
          nationalId: `%${filterDto.person.nationalId}%`,
        });
      }

      if (filterDto.person.isPalestinian !== undefined) {
        qb.andWhere('person.isPalestinian = :isPalestinian', {
          isPalestinian: filterDto.person.isPalestinian,
        });
      }

      if (filterDto.person.gender) {
        qb.andWhere('person.gender = :gender', {
          gender: filterDto.person.gender,
        });
      }
      if (filterDto.person.nationality) {
        qb.andWhere('person.nationality LIKE :nationality', {
          nationality: `%${filterDto.person.nationality}%`,
        });
      }

      if (filterDto.person.phone) {
        qb.andWhere('person.phone LIKE :phone', {
          phone: `%${filterDto.person.phone}%`,
        });
      }

      if (filterDto.person.email) {
        qb.andWhere('person.email LIKE :email', {
          email: `%${filterDto.person.email}%`,
        });
      }

      if (filterDto.person.birthDateFrom && filterDto.person.birthDateTo) {
        qb.andWhere('person.birthDate BETWEEN :birthDateFrom AND :birthDateTo', {
          birthDateFrom: filterDto.person.birthDateFrom,
          birthDateTo: filterDto.person.birthDateTo,
        });
      } else if (filterDto.person.birthDateFrom) {
        qb.andWhere('person.birthDate >= :birthDateFrom', {
          birthDateFrom: filterDto.person.birthDateFrom,
        });
      } else if (filterDto.person.birthDateTo) {
        qb.andWhere('person.birthDate <= :birthDateTo', {
          birthDateTo: filterDto.person.birthDateTo,
        });
      }
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

  async update(id: number, updateData: UpdateFamilyMemberDto): Promise<FamilyMember> {
    return await this.familyMemberRepository.manager.transaction(async (entityManager) => {
      const familyMember = await this.findOne(id, { relations: ['person', 'childSponsorships'] });

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
