import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { paginate } from '../../../common/pagination/paginate.service';
import { FamiliesService } from '../../../modules/families/services/families.service';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';
import { applyFamilyFilters } from '../../families/utils/family-filter.util';
import { FilterEmergencyAidRequestDto } from '../dtos/queries/filter-emergency-aid-request.dto';
import { CreateEmergencyAidRequestDto } from '../dtos/requests/create-emergency-aid-request.dto';
import { UpdateEmergencyAidRequestDto } from '../dtos/requests/update-emergency-aid-request.dto';
import { EmergencyAidRequestResponseDto } from '../dtos/responses/emergency-aid-request-response.dto';
import { EmergencyAidRequest } from '../entities/emergency-aid-request.entity';
import { applyEmergencyAidRequestFilters } from '../utils/emergency-aid-request-filter.util';

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
    const family = await this.familiesService.findOne(
      createEmergencyAidRequestDto.familyId,
    );

    const emergencyAidRequest = this.emergencyAidRepository.create(
      createEmergencyAidRequestDto,
    );
    const savedEmergencyAidRequest =
      await this.emergencyAidRepository.save(emergencyAidRequest);

    return { ...savedEmergencyAidRequest, family };
  }

  async update(
    id: number,
    updateEmergencyAidRequestDto: UpdateEmergencyAidRequestDto,
  ): Promise<EmergencyAidRequest> {
    const emergencyAidRequest = await this.findOne(id, {
      relations: ['family'],
    });

    this.emergencyAidRepository.merge(
      emergencyAidRequest,
      updateEmergencyAidRequestDto,
    );
    return await this.emergencyAidRepository.save(emergencyAidRequest);
  }

  async delete(id: number): Promise<void> {
    const result = await this.emergencyAidRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        this.translateHelper.tr('emergency-aid-request.errors.not_found', {
          id,
        }),
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
        this.translateHelper.tr('emergency-aid-request.errors.not_found', {
          id,
        }),
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

    if (filterDto.family) {
      applyFamilyFilters(queryBuilder, 'family', filterDto.family);
    }

    applyEmergencyAidRequestFilters(
      queryBuilder,
      'emergencyAidRequest',
      filterDto,
    );

    return paginate(queryBuilder, filterDto, EmergencyAidRequestResponseDto);
  }
}
