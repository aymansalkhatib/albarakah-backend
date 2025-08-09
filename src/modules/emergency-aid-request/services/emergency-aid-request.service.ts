import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';
import { FamiliesService } from '../../../modules/families/services/families.service';
import { FilterEmergencyAidRequestDto } from '../dtos/queries/filter-emergency-aid-request.dto';
import { CreateEmergencyAidRequestDto } from '../dtos/requests/create-emergency-aid-request.dto';
import { UpdateEmergencyAidRequestDto } from '../dtos/requests/update-emergency-aid-request.dto';
import { EmergencyAidRequest } from '../entities/emergency-aid-request.entity';
import { paginate } from '../../../common/pagination/paginate.service';
import { EmergencyAidRequestResponseDto } from '../dtos/responses/emergency-aid-request-response.dto';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';

@Injectable()
export class EmergencyAidRequestService {
  constructor(
    @InjectRepository(EmergencyAidRequest)
    private readonly emergencyAidRepository: Repository<EmergencyAidRequest>,
    private readonly familiesService: FamiliesService,
    private readonly translateHelper: TranslateHelper,
  ) {}

  async create(
    createEmergencyAidRequestDto: CreateEmergencyAidRequestDto,
  ): Promise<EmergencyAidRequest> {
    const family = await this.familiesService.findOne(createEmergencyAidRequestDto.familyId);

    const emergencyAidRequest = this.emergencyAidRepository.create(createEmergencyAidRequestDto);
    const savedEmergencyAidRequest = await this.emergencyAidRepository.save(emergencyAidRequest);

    return { ...savedEmergencyAidRequest, family };
  }

  async update(
    id: number,
    updateEmergencyAidRequestDto: UpdateEmergencyAidRequestDto,
  ): Promise<EmergencyAidRequest> {
    const emergencyAidRequest = await this.findOne(id, { relations: ['family'] });

    this.emergencyAidRepository.merge(emergencyAidRequest, updateEmergencyAidRequestDto);
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
    options: FindOneOptions<EmergencyAidRequest> = {},
  ): Promise<EmergencyAidRequest> {
    const emergencyAidRequest = await this.emergencyAidRepository.findOne({
      where: { id },
      ...options,
    });

    if (!emergencyAidRequest) {
      throw new NotFoundException(
        this.translateHelper.tr('emergency-aid-request.errors.not_found', { id }),
      );
    }

    return emergencyAidRequest;
  }

  async findAll(
    filterDto: FilterEmergencyAidRequestDto,
  ): Promise<PaginationResponseDto<EmergencyAidRequestResponseDto>> {
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
      queryBuilder.andWhere('emergencyAidRequest.notes ILIKE :notes', {
        notes: `%${filterDto.notes}%`,
      });
    }

    return paginate(queryBuilder, filterDto, EmergencyAidRequestResponseDto);
  }
}
