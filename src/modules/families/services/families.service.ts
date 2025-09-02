import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EntityManager, FindOneOptions, Repository } from 'typeorm';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { paginate } from '../../../common/pagination/paginate.service';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';
import { FilterFamilyDto } from '../dtos/queries/filter-family.dto';
import { CreateFamilyDto } from '../dtos/requests/create-family-dto';
import { UpdateFamilyDto } from '../dtos/requests/update-family-dto';
import { FamilyResponseDto } from '../dtos/responses/family-response.dto';
import { Family } from '../entities/families.entity';
import { applyFamilyFilters } from '../utils/family-filter.util';

@Injectable()
export class FamiliesService {
  constructor(
    @InjectRepository(Family)
    private readonly familyRepository: Repository<Family>,
    private readonly translateHelper: TranslateHelper,
  ) {}

  async create(
    createFamilyDto: CreateFamilyDto,
    entityManager?: EntityManager,
  ): Promise<Family> {
    const familyRepository =
      entityManager?.getRepository(Family) ?? this.familyRepository;

    if (createFamilyDto.familyBookNumber) {
      const existingFamily = await this.findOneByFamilyBookNumber(
        createFamilyDto.familyBookNumber,
      );
      if (existingFamily) {
        throw new ConflictException(
          this.translateHelper.tr('families.family_book_number_exists'),
        );
      }
    }

    if (createFamilyDto.requestNumber) {
      const existingFamily = await this.findOneByRequestNumber(
        createFamilyDto.requestNumber,
      );
      if (existingFamily) {
        throw new ConflictException(
          this.translateHelper.tr('families.request_number_exists'),
        );
      }
    }
    const family = familyRepository.create(createFamilyDto);
    return familyRepository.save(family);
  }

  async findAll(
    filter: FilterFamilyDto,
  ): Promise<PaginationResponseDto<FamilyResponseDto>> {
    const queryBuilder = this.familyRepository.createQueryBuilder('family');
    applyFamilyFilters(queryBuilder, 'family', filter);
    return paginate(queryBuilder, filter, FamilyResponseDto);
  }

  async findOne(
    id: number,
    options: FindOneOptions<Family> = {},
    entityManager?: EntityManager,
  ): Promise<Family> {
    const familyRepository =
      entityManager?.getRepository(Family) ?? this.familyRepository;

    const family = await familyRepository.findOne({
      where: { id },
      ...options,
    });
    if (!family) {
      throw new NotFoundException(
        this.translateHelper.tr('families.not_found'),
      );
    }
    return family;
  }

  async update(id: number, updateFamilyDto: UpdateFamilyDto): Promise<Family> {
    const family = await this.familyRepository.findOneById(id);

    if (!family) {
      throw new NotFoundException(
        this.translateHelper.tr('families.not_found'),
      );
    }

    if (updateFamilyDto.familyBookNumber) {
      const existingFamily = await this.findOneByFamilyBookNumber(
        updateFamilyDto.familyBookNumber,
      );

      if (existingFamily && existingFamily.id !== id) {
        throw new ConflictException(
          this.translateHelper.tr('families.family_book_number_exists_another'),
        );
      }
    }

    if (updateFamilyDto.requestNumber) {
      const existingFamily = await this.findOneByRequestNumber(
        updateFamilyDto.requestNumber,
      );
      if (existingFamily && existingFamily.id !== id) {
        throw new ConflictException(
          this.translateHelper.tr('families.request_number_exists_another'),
        );
      }
    }

    const updatedFamily = this.familyRepository.merge(family, updateFamilyDto);
    return this.familyRepository.save(updatedFamily);
  }

  async delete(id: number): Promise<void> {
    const result = await this.familyRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(
        this.translateHelper.tr('families.not_found'),
      );
    }
  }

  // private methods
  private findOneByFamilyBookNumber(
    familyBookNumber: string,
  ): Promise<Family | undefined> {
    return this.familyRepository.findOneBy({ familyBookNumber });
  }

  private findOneByRequestNumber(
    requestNumber: string,
  ): Promise<Family | undefined> {
    return this.familyRepository.findOneBy({ requestNumber });
  }
}
