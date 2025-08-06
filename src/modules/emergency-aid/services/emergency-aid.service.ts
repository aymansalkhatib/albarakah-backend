import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TranslateHelper } from '@app/shared/modules/app-i18n/translate.helper';
import { FamiliesService } from '@app/modules/families/services/families.service';
import { FilterEmergencyAidDto } from '../dtos/queries/filter-emergency-aid.dto';
import { CreateEmergencyAidDto } from '../dtos/requests/create-emergency-aid.dto';
import { UpdateEmergencyAidDto } from '../dtos/requests/update-emergency-aid.dto';
import { EmergencyAidRequest } from '../entities/emergency-aid-request.entity';
import { EmergencyAidRequestStatus } from '../enums/emergency-aid-request-status.enum';
import { paginate } from '@app/common/pagination/paginate.service';
import { EmergencyAidResponseDto } from '../dtos/responses/emergency-aid-response.dto';
import { PaginationResponseDto } from '@app/common/pagination/dto/pagination-response.dto';

@Injectable()
export class EmergencyAidService {
  constructor(
    @InjectRepository(EmergencyAidRequest)
    private readonly emergencyAidRepository: Repository<EmergencyAidRequest>,
    private readonly familiesService: FamiliesService,
    private readonly translateHelper: TranslateHelper,
  ) {}

  async create(createEmergencyAidRequestDto: CreateEmergencyAidDto): Promise<EmergencyAidRequest> {
    await this.familiesService.findOne(createEmergencyAidRequestDto.familyId);

    const emergencyAidRequest = this.emergencyAidRepository.create(createEmergencyAidRequestDto);
    return await this.emergencyAidRepository.save(emergencyAidRequest);
  }

  async update(
    id: number,
    updateEmergencyAidDto: UpdateEmergencyAidDto,
  ): Promise<EmergencyAidRequest> {
    const emergencyAidRequest = await this.findOne(id);

    if (
      updateEmergencyAidDto.familyId &&
      updateEmergencyAidDto.familyId !== emergencyAidRequest.familyId
    ) {
      await this.familiesService.findOne(updateEmergencyAidDto.familyId);
    }

    this.emergencyAidRepository.merge(emergencyAidRequest, updateEmergencyAidDto);
    return await this.emergencyAidRepository.save(emergencyAidRequest);
  }

  async delete(id: number): Promise<void> {
    const result = await this.emergencyAidRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        this.translateHelper.tr('emergency-aid-request.errors.not_found', { id }),
      );
    }
  }

  async findOne(
    id: number,
    { relations }: { relations?: string[] } = {},
  ): Promise<EmergencyAidRequest> {
    const emergencyAidRequest = await this.emergencyAidRepository.findOne({
      where: { id },
      relations: relations || [],
    });

    if (!emergencyAidRequest) {
      throw new NotFoundException(
        this.translateHelper.tr('emergency-aid-request.errors.not_found', { id }),
      );
    }

    return emergencyAidRequest;
  }

  async findAll(
    filterDto: FilterEmergencyAidDto,
  ): Promise<{ data: EmergencyAidRequest[]; total: number }> {
    const queryBuilder = this.emergencyAidRepository
      .createQueryBuilder('emergencyAidRequest')
      .leftJoinAndSelect('emergencyAidRequest.family', 'family');

    if (filterDto.familyId) {
      queryBuilder.andWhere('emergencyAidRequest.familyId = :familyId', {
        familyId: filterDto.familyId,
      });
    }

    if (filterDto.requestStatus) {
      queryBuilder.andWhere('emergencyAidRequest.requestStatus = :requestStatus', {
        requestStatus: filterDto.requestStatus,
      });
    }

    if (filterDto.requestedAmountFrom && filterDto.requestedAmountTo) {
      queryBuilder.andWhere(
        'emergencyAidRequest.requestedAmount BETWEEN :requestedAmountFrom AND :requestedAmountTo',
        {
          requestedAmountFrom: filterDto.requestedAmountFrom,
          requestedAmountTo: filterDto.requestedAmountTo,
        },
      );
    } else if (filterDto.requestedAmountFrom) {
      queryBuilder.andWhere('emergencyAidRequest.requestedAmount >= :requestedAmountFrom', {
        requestedAmountFrom: filterDto.requestedAmountFrom,
      });
    } else if (filterDto.requestedAmountTo) {
      queryBuilder.andWhere('emergencyAidRequest.requestedAmount <= :requestedAmountTo', {
        requestedAmountTo: filterDto.requestedAmountTo,
      });
    }

    if (filterDto.disbursedAmountFrom && filterDto.disbursedAmountTo) {
      queryBuilder.andWhere(
        'emergencyAidRequest.disbursedAmount BETWEEN :disbursedAmountFrom AND :disbursedAmountTo',
        {
          disbursedAmountFrom: filterDto.disbursedAmountFrom,
          disbursedAmountTo: filterDto.disbursedAmountTo,
        },
      );
    } else if (filterDto.disbursedAmountFrom) {
      queryBuilder.andWhere('emergencyAidRequest.disbursedAmount >= :disbursedAmountFrom', {
        disbursedAmountFrom: filterDto.disbursedAmountFrom,
      });
    } else if (filterDto.disbursedAmountTo) {
      queryBuilder.andWhere('emergencyAidRequest.disbursedAmount <= :disbursedAmountTo', {
        disbursedAmountTo: filterDto.disbursedAmountTo,
      });
    }

    if (filterDto.requestDateFrom && filterDto.requestDateTo) {
      queryBuilder.andWhere(
        'emergencyAidRequest.requestDate BETWEEN :requestDateFrom AND :requestDateTo',
        {
          requestDateFrom: filterDto.requestDateFrom,
          requestDateTo: filterDto.requestDateTo,
        },
      );
    } else if (filterDto.requestDateFrom) {
      queryBuilder.andWhere('emergencyAidRequest.requestDate >= :requestDateFrom', {
        requestDateFrom: filterDto.requestDateFrom,
      });
    } else if (filterDto.requestDateTo) {
      queryBuilder.andWhere('emergencyAidRequest.requestDate <= :requestDateTo', {
        requestDateTo: filterDto.requestDateTo,
      });
    }

    if (filterDto.disbursementDateFrom && filterDto.disbursementDateTo) {
      queryBuilder.andWhere(
        'emergencyAidRequest.disbursementDate BETWEEN :disbursementDateFrom AND :disbursementDateTo',
        {
          disbursementDateFrom: filterDto.disbursementDateFrom,
          disbursementDateTo: filterDto.disbursementDateTo,
        },
      );
    } else if (filterDto.disbursementDateFrom) {
      queryBuilder.andWhere('emergencyAidRequest.disbursementDate >= :disbursementDateFrom', {
        disbursementDateFrom: filterDto.disbursementDateFrom,
      });
    } else if (filterDto.disbursementDateTo) {
      queryBuilder.andWhere('emergencyAidRequest.disbursementDate <= :disbursementDateTo', {
        disbursementDateTo: filterDto.disbursementDateTo,
      });
    }

    if (filterDto.familyName) {
      queryBuilder.andWhere('family.familyName LIKE :familyName', {
        familyName: `%${filterDto.familyName}%`,
      });
    }

    if (filterDto.notes) {
      queryBuilder.andWhere('emergencyAidRequest.notes LIKE :notes', {
        notes: `%${filterDto.notes}%`,
      });
    }

    // General search
    if (filterDto.search) {
      queryBuilder.andWhere(
        `(
          family.familyName LIKE :search OR
          family.familyCode LIKE :search OR
          COALESCE(emergencyAidRequest.notes, '') LIKE :search OR
          CAST(emergencyAidRequest.requestedAmount AS TEXT) LIKE :search OR
          CAST(emergencyAidRequest.disbursedAmount AS TEXT) LIKE :search
        )`,
        { search: `%${filterDto.search}%` },
      );
    }

    const page = Math.max(filterDto.page || 1, 1);
    const limit = Math.min(Math.max(filterDto.limit || 10, 1), 100);
    const skip = (page - 1) * limit;

    const [data, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

    return { data, total };
  }

  async approve(
    id: number,
    disbursedAmount?: number,
    notes?: string,
  ): Promise<EmergencyAidRequest> {
    const emergencyAidRequest = await this.findOne(id);

    if (emergencyAidRequest.requestStatus !== EmergencyAidRequestStatus.PENDING) {
      throw new ConflictException(
        this.translateHelper.tr('emergency-aid-request.errors.cannot_approve_non_pending'),
      );
    }

    emergencyAidRequest.requestStatus = EmergencyAidRequestStatus.APPROVED;
    if (disbursedAmount !== undefined) {
      emergencyAidRequest.disbursedAmount = disbursedAmount;
    }
    if (notes !== undefined) {
      emergencyAidRequest.notes = notes;
    }

    return await this.emergencyAidRepository.save(emergencyAidRequest);
  }

  async reject(id: number, notes?: string): Promise<EmergencyAidRequest> {
    const emergencyAidRequest = await this.findOne(id);

    if (emergencyAidRequest.requestStatus !== EmergencyAidRequestStatus.PENDING) {
      throw new ConflictException(
        this.translateHelper.tr('emergency-aid-request.errors.cannot_reject_non_pending'),
      );
    }

    emergencyAidRequest.requestStatus = EmergencyAidRequestStatus.REJECTED;
    if (notes !== undefined) {
      emergencyAidRequest.notes = notes;
    }

    return await this.emergencyAidRepository.save(emergencyAidRequest);
  }

  async disburse(
    id: number,
    disbursedAmount?: number,
    notes?: string,
  ): Promise<EmergencyAidRequest> {
    const emergencyAidRequest = await this.findOne(id);

    if (emergencyAidRequest.requestStatus !== EmergencyAidRequestStatus.APPROVED) {
      throw new ConflictException(
        this.translateHelper.tr('emergency-aid-request.errors.cannot_disburse_non_approved'),
      );
    }

    emergencyAidRequest.requestStatus = EmergencyAidRequestStatus.DISBURSED;
    emergencyAidRequest.disbursementDate = new Date();

    if (disbursedAmount !== undefined) {
      emergencyAidRequest.disbursedAmount = disbursedAmount;
    }
    if (notes !== undefined) {
      emergencyAidRequest.notes = notes;
    }

    return await this.emergencyAidRepository.save(emergencyAidRequest);
  }

  async cancel(id: number, notes?: string): Promise<EmergencyAidRequest> {
    const emergencyAidRequest = await this.findOne(id);

    if (
      emergencyAidRequest.requestStatus !== EmergencyAidRequestStatus.PENDING &&
      emergencyAidRequest.requestStatus !== EmergencyAidRequestStatus.APPROVED
    ) {
      throw new ConflictException(
        this.translateHelper.tr('emergency-aid-request.errors.cannot_cancel_unmodifiable'),
      );
    }

    emergencyAidRequest.requestStatus = EmergencyAidRequestStatus.CANCELLED;

    if (notes !== undefined) {
      emergencyAidRequest.notes = notes;
    }

    return await this.emergencyAidRepository.save(emergencyAidRequest);
  }
}
