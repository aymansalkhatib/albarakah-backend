import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { PaginationResponseDto } from '../../.././common/pagination/dto/pagination-response.dto';
import { paginate } from '../../.././common/pagination/paginate.service';
import { FamiliesService } from '../../.././modules/families/services/families.service';
import { FamilyMembersService } from '../../.././modules/family-members/services/family-members.service';
import { TranslateHelper } from '../../.././shared/modules/app-i18n/translate.helper';
import { FilterReceivedAssistanceDto } from '../dtos/queries/filter-received-assistance.dto';
import { CreateReceivedAssistanceDto } from '../dtos/requests/create-received-assistance.dto';
import { UpdateReceivedAssistanceDto } from '../dtos/requests/update-received-assistance.dto';
import { ReceivedAssistanceResponseDto } from '../dtos/responses/received-assistance-response.dto';
import { ReceivedAssistance } from '../entities/received-assistance.entity';

@Injectable()
export class ReceivedAssistanceService {
  constructor(
    @InjectRepository(ReceivedAssistance)
    private readonly repository: Repository<ReceivedAssistance>,
    private readonly familiesService: FamiliesService,
    private readonly familyMembersService: FamilyMembersService,
    private readonly translateHelper: TranslateHelper,
  ) {}

  async create(
    createDto: CreateReceivedAssistanceDto,
  ): Promise<ReceivedAssistance> {
    const family = await this.familiesService.findOne(createDto.familyId);

    const entity = this.repository.create(createDto);
    const saved = await this.repository.save(entity);

    return { ...saved, family };
  }

  async update(
    id: number,
    updateDto: UpdateReceivedAssistanceDto,
  ): Promise<ReceivedAssistance> {
    const entity = await this.findOne(id, {
      relations: ['family'],
    });

    this.repository.merge(entity, updateDto);
    return await this.repository.save(entity);
  }

  async delete(id: number): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        this.translateHelper.tr('received-assistance.errors.not_found', { id }),
      );
    }
  }

  async findOne(
    id: number,
    options: FindOneOptions<ReceivedAssistance> = {},
  ): Promise<ReceivedAssistance> {
    const entity = await this.repository.findOne({
      where: { id },
      ...options,
    });

    if (!entity) {
      throw new NotFoundException(
        this.translateHelper.tr('received-assistance.errors.not_found', { id }),
      );
    }

    return entity;
  }

  async findAll(
    filterDto: FilterReceivedAssistanceDto,
  ): Promise<PaginationResponseDto<ReceivedAssistanceResponseDto>> {
    const qb = this.repository
      .createQueryBuilder('receivedAssistance')
      .leftJoinAndSelect('receivedAssistance.family', 'family')

      .leftJoin(
        'family.familyMembers',
        'familyMembers',
        'familyMembers.isGuardian = :isGuardian',
        { isGuardian: true },
      )
      .addSelect(['familyMembers.id', 'familyMembers.person'])
      .leftJoin('familyMembers.person', 'person')
      .addSelect(['person.id', 'person.fullName']);

    if (filterDto.familyId) {
      qb.andWhere('receivedAssistance.familyId = :familyId', {
        familyId: filterDto.familyId,
      });
    }

    if (filterDto.assistanceType) {
      qb.andWhere('receivedAssistance.assistanceType = :assistanceType', {
        assistanceType: filterDto.assistanceType,
      });
    }

    if (filterDto.amountFrom && filterDto.amountTo) {
      qb.andWhere(
        'receivedAssistance.amount BETWEEN :amountFrom AND :amountTo',
        {
          amountFrom: filterDto.amountFrom,
          amountTo: filterDto.amountTo,
        },
      );
    } else if (filterDto.amountFrom) {
      qb.andWhere('receivedAssistance.amount >= :amountFrom', {
        amountFrom: filterDto.amountFrom,
      });
    } else if (filterDto.amountTo) {
      qb.andWhere('receivedAssistance.amount <= :amountTo', {
        amountTo: filterDto.amountTo,
      });
    }

    if (filterDto.deliveryDateFrom && filterDto.deliveryDateTo) {
      qb.andWhere(
        'receivedAssistance.deliveryDate BETWEEN :deliveryDateFrom AND :deliveryDateTo',
        {
          deliveryDateFrom: filterDto.deliveryDateFrom,
          deliveryDateTo: filterDto.deliveryDateTo,
        },
      );
    } else if (filterDto.deliveryDateFrom) {
      qb.andWhere('receivedAssistance.deliveryDate >= :deliveryDateFrom', {
        deliveryDateFrom: filterDto.deliveryDateFrom,
      });
    } else if (filterDto.deliveryDateTo) {
      qb.andWhere('receivedAssistance.deliveryDate <= :deliveryDateTo', {
        deliveryDateTo: filterDto.deliveryDateTo,
      });
    }

    if (filterDto.notes) {
      qb.andWhere('receivedAssistance.notes ILIKE :notes', {
        notes: `%${filterDto.notes}%`,
      });
    }

    return paginate(qb, filterDto, ReceivedAssistanceResponseDto);
  }
}
