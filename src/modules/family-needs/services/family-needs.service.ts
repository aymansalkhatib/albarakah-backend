import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { paginate } from '../../../common/pagination/paginate.service';
import { FamiliesService } from '../../../modules/families/services/families.service';
import { FamilyMember } from '../../../modules/family-members/entities/family-members.entity';
import { FamilyMembersService } from '../../../modules/family-members/services/family-members.service';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';
import { FamilyNeedResponseDto } from '../dtos';
import { FilterFamilyNeedDto } from '../dtos/queries/filter-family-need.dto';
import { CreateFamilyNeedDto } from '../dtos/requests/create-family-need.dto';
import { UpdateFamilyNeedDto } from '../dtos/requests/update-family-need.dto';
import { FamilyNeed } from '../entities/family-need.entity';

@Injectable()
export class FamilyNeedsService {
  constructor(
    @InjectRepository(FamilyNeed)
    private readonly familyNeedRepository: Repository<FamilyNeed>,
    private readonly familiesService: FamiliesService,
    private readonly familyMembersService: FamilyMembersService,
    private readonly t: TranslateHelper,
  ) {}

  async create(createFamilyNeedDto: CreateFamilyNeedDto): Promise<FamilyNeed> {
    const family = await this.familiesService.findOne(
      createFamilyNeedDto.familyId,
    );

    let familyMember: FamilyMember | undefined;
    if (createFamilyNeedDto.familyMemberId) {
      familyMember = await this.familyMembersService.findOne(
        createFamilyNeedDto.familyMemberId,
        {
          relations: ['person'],
        },
      );
    }

    const newFamilyNeed = this.familyNeedRepository.create(createFamilyNeedDto);
    const savedFamilyNeed = await this.familyNeedRepository.save(newFamilyNeed);

    return { ...savedFamilyNeed, family, familyMember };
  }

  async findAll(
    filter: FilterFamilyNeedDto,
  ): Promise<PaginationResponseDto<FamilyNeedResponseDto>> {
    const query = this.familyNeedRepository
      .createQueryBuilder('familyNeed')
      .leftJoinAndSelect('familyNeed.family', 'family')
      .leftJoinAndSelect('familyNeed.familyMember', 'familyMember')
      .leftJoinAndSelect('familyMember.person', 'person');

    if (filter.familyId) {
      query.andWhere('familyNeed.familyId = :familyId', {
        familyId: filter.familyId,
      });
    }

    if (filter.familyMemberId) {
      query.andWhere('familyNeed.familyMemberId = :familyMemberId', {
        familyMemberId: filter.familyMemberId,
      });
    }

    if (filter.priorityLevel) {
      query.andWhere('familyNeed.priorityLevel = :priorityLevel', {
        priorityLevel: filter.priorityLevel,
      });
    }

    if (filter.status) {
      query.andWhere('familyNeed.status = :status', { status: filter.status });
    }

    if (filter.needType) {
      query.andWhere('LOWER(familyNeed.needType) LIKE :needType', {
        needType: `%${filter.needType.toLowerCase()}%`,
      });
    }

    if (filter.notes) {
      query.andWhere('LOWER(familyNeed.notes) LIKE :notes', {
        notes: `%${filter.notes.toLowerCase()}%`,
      });
    }

    if (filter.minQuantity !== undefined) {
      query.andWhere('familyNeed.quantity >= :minQuantity', {
        minQuantity: filter.minQuantity,
      });
    }

    if (filter.maxQuantity !== undefined) {
      query.andWhere('familyNeed.quantity <= :maxQuantity', {
        maxQuantity: filter.maxQuantity,
      });
    }

    // Sorting
    query.orderBy('familyNeed.createdAt', filter.sortOrder || 'DESC');

    return paginate(query, filter, FamilyNeedResponseDto);
  }

  async findOne(
    id: number,
    options: FindOneOptions<FamilyNeed> = {},
  ): Promise<FamilyNeed> {
    const familyNeed = await this.familyNeedRepository.findOne({
      where: { id },
      ...options,
    });

    if (!familyNeed) {
      throw new NotFoundException(this.t.tr('family-needs.errors.not_found'));
    }

    return familyNeed;
  }

  async update(
    id: number,
    updateFamilyNeedDto: UpdateFamilyNeedDto,
  ): Promise<FamilyNeed> {
    const familyNeed = await this.findOne(id, {
      relations: ['family', 'familyMember', 'familyMember.person'],
    });
    this.familyNeedRepository.merge(familyNeed, updateFamilyNeedDto);
    return await this.familyNeedRepository.save(familyNeed);
  }

  async delete(id: number): Promise<void> {
    const result = await this.familyNeedRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(this.t.tr('family-needs.errors.not_found'));
    }
  }
}
