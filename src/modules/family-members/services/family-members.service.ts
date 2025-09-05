import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOneOptions, Not, Repository } from 'typeorm';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { paginate } from '../../../common/pagination/paginate.service';
import { FamiliesService } from '../../../modules/families/services/families.service';
import { Person } from '../../../modules/persons/entities/person.entity';
import { PersonRelation } from '../../../modules/persons/enums/person-relation.enum';
import { PersonsService } from '../../../modules/persons/services/persons.service';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';
import { applyPersonFilters } from '../../persons/utils/person-filter.util';
import { FamilyMemberFilterDto } from '../dtos/queries/family-member-filter.dto';
import { CreateFamilyMemberDto } from '../dtos/requests/create-family-member.dto';
import { UpdateFamilyMemberDto } from '../dtos/requests/update-family-member.dto';
import { FamilyMemberResponseDto } from '../dtos/responses/family-member-response.dto';
import { FamilyMember } from '../entities/family-members.entity';
import { FamilyRelationType } from '../enums/family-relation-type.enum';
import { IsSponsored } from '../enums/is-sponsored.enum';
import { applyFamilyMemberFilters } from '../utils';

@Injectable()
export class FamilyMembersService {
  constructor(
    @InjectRepository(FamilyMember)
    private readonly familyMemberRepository: Repository<FamilyMember>,
    private readonly familiesService: FamiliesService,
    private readonly personsService: PersonsService,
    private readonly translateHelper: TranslateHelper,
  ) {}

  async create(
    createFamilyMemberDto: CreateFamilyMemberDto,
    entityManager?: EntityManager,
  ): Promise<FamilyMember> {
    const repo =
      entityManager?.getRepository(FamilyMember) ?? this.familyMemberRepository;

    if (entityManager) {
      return this.createFamilyMemberInternal(
        createFamilyMemberDto,
        entityManager,
      );
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

    if (createFamilyMemberDto.isGuardian) {
      const hasGuardian = await this.hasGuardian(
        createFamilyMemberDto.familyId,
        em,
      );
      if (hasGuardian) {
        throw new ConflictException(
          this.translateHelper.tr(
            'family-members.errors.family_already_has_guardian',
          ),
        );
      }
    }

    let person: Person;

    if (createFamilyMemberDto.personId) {
      const foundPerson = await this.personsService.findOne(
        createFamilyMemberDto.personId,
        { relations: ['familyMember'] },
        em,
      );

      if (foundPerson.familyMember) {
        throw new ConflictException(
          this.translateHelper.tr(
            'family-members.errors.person_already_family_member',
          ),
        );
      }
      person = foundPerson;
    } else {
      person = await this.personsService.create(
        createFamilyMemberDto.person,
        em,
      );
    }

    if (createFamilyMemberDto.relationType === FamilyRelationType.FATHER) {
      const member = await em.findOne(FamilyMember, {
        where: {
          familyId: createFamilyMemberDto.familyId,
          relationType: FamilyRelationType.FATHER,
        },
      });
      if (member) {
        throw new ConflictException(
          this.translateHelper.tr(
            'family-members.errors.family_already_has_father',
          ),
        );
      }
    }

    if (createFamilyMemberDto.isSponsored === IsSponsored.YES) {
      const relation = createFamilyMemberDto.relationType;
      if (
        relation !== FamilyRelationType.DAUGHTER &&
        relation !== FamilyRelationType.SON
      ) {
        throw new ConflictException(
          this.translateHelper.tr(
            'family-members.errors.only_children_can_be_sponsored',
          ),
        );
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
      .leftJoinAndSelect('family_member.courseBatches', 'courseBatches')
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

  async findOne(
    id: number,
    options: FindOneOptions<FamilyMember> = {},
  ): Promise<FamilyMember> {
    const familyMember = await this.familyMemberRepository.findOne({
      where: { id },
      ...options,
    });
    if (!familyMember) {
      throw new NotFoundException(
        this.translateHelper.tr('family-members.errors.not_found'),
      );
    }
    return familyMember;
  }

  async findOneDetailed(id: number): Promise<FamilyMember> {
    // Use query builder to include current active sponsor relations only
    const familyMember = await this.familyMemberRepository
      .createQueryBuilder('family_member')
      .leftJoinAndSelect('family_member.person', 'person')
      .leftJoinAndSelect('family_member.family', 'family')
      .leftJoinAndSelect('family_member.courseBatches', 'courseBatches')
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
      throw new NotFoundException(
        this.translateHelper.tr('family-members.errors.not_found_with_id', {
          id,
        }),
      );
    }
    return familyMember;
  }

  async update(
    id: number,
    updateData: UpdateFamilyMemberDto,
  ): Promise<FamilyMember> {
    return await this.familyMemberRepository.manager.transaction(async (em) => {
      const familyMember = await this.findOneDetailed(id);

      if (updateData.isGuardian) {
        const hasGuardian = await this.hasGuardian(
          familyMember.familyId,
          em,
          familyMember.id,
        );
        if (hasGuardian) {
          throw new ConflictException(
            this.translateHelper.tr(
              'family-members.errors.family_already_has_guardian',
            ),
          );
        }
      }

      if (
        updateData.relationType &&
        updateData.relationType !== familyMember.relationType &&
        familyMember?.childSponsorships?.length > 0
      ) {
        throw new ConflictException(
          this.translateHelper.tr(
            'family-members.errors.cannot_change_relation_with_sponsorships',
          ),
        );
      }

      // new relationType is Father => check if have already father
      if (
        updateData.relationType === FamilyRelationType.FATHER &&
        familyMember.relationType != updateData.relationType
      ) {
        const existingFather = await em.getRepository(FamilyMember).exists({
          where: {
            familyId: familyMember.familyId,
            relationType: FamilyRelationType.FATHER,
          },
        });
        if (existingFather) {
          throw new ConflictException(
            this.translateHelper.tr(
              'family-members.errors.family_already_has_father',
            ),
          );
        }
      }

      // check if relationType match gender
      const isSponsored = updateData?.isSponsored ?? familyMember?.isSponsored;

      //
      if (isSponsored === IsSponsored.YES) {
        const relation = updateData.relationType;
        if (
          relation !== FamilyRelationType.DAUGHTER &&
          relation !== FamilyRelationType.SON
        ) {
          throw new ConflictException(
            this.translateHelper.tr(
              'family-members.errors.only_children_can_be_sponsored',
            ),
          );
        }
      }

      if (updateData.person) {
        familyMember.person = await this.personsService.update(
          familyMember.person.id,
          updateData.person,
        );
        delete updateData.person;
      }

      em.getRepository(FamilyMember).merge(familyMember, updateData);
      return await em.getRepository(FamilyMember).save(familyMember);
    });
  }

  async delete(id: number): Promise<void> {
    const familyMember = await this.findOne(id);
    await this.familyMemberRepository.delete(id);
    await this.personsService.deleteIf(
      familyMember.personId,
      PersonRelation.FAMILY_MEMBER,
    );
  }

  // private methods

  /**
   * Checks if the given family already has a guardian (وصي).
   * Returns true if a guardian exists, otherwise false.
   */
  async hasGuardian(
    familyId: number,
    entityManager: EntityManager,
    excludeId?: number,
  ): Promise<boolean> {
    const count = await entityManager?.getRepository(FamilyMember).count({
      where: {
        familyId,
        isGuardian: true,
        ...(excludeId && { id: Not(excludeId) }),
      },
    });
    return count > 0;
  }
}
