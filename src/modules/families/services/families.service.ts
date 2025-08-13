import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateFamilyDto } from '../dtos/requests/update-family-dto';
import { Family } from '../entities/families.entity';
import { CreateFamilyDto } from '../dtos/requests/create-family-dto';
import { FilterFamilyDto } from '../dtos/queries/filter-family.dto';
import { Repository } from 'typeorm';
import { applyFamilyFilters } from '../utils';
import { paginate } from '../../../common/pagination/paginate.service';
import { FamilyResponseDto } from '../dtos/responses/family-response.dto';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';

@Injectable()
export class FamiliesService {
  constructor(
    @InjectRepository(Family)
    private readonly familyRepository: Repository<Family>,
  ) {}

  async create(createFamilyDto: CreateFamilyDto): Promise<Family> {
    if (createFamilyDto.familyBookNumber) {
      const existingFamily = await this.findOneByFamilyBookNumber(createFamilyDto.familyBookNumber);
      if (existingFamily) {
        throw new ConflictException('Family book number already exists');
      }
    }
    const family = this.familyRepository.create(createFamilyDto);
    return this.familyRepository.save(family);
  }

  async findAll(filter: FilterFamilyDto): Promise<PaginationResponseDto<FamilyResponseDto>> {
    const queryBuilder = this.familyRepository.createQueryBuilder('family');
    applyFamilyFilters(queryBuilder, 'family', filter);
    return paginate(queryBuilder, filter, FamilyResponseDto);
  }

  async findOne(id: number): Promise<Family> {
    const family = await this.familyRepository.findOneById(id);
    if (!family) {
      throw new NotFoundException('family not found');
    }
    return family;
  }

  async update(id: number, updateFamilyDto: UpdateFamilyDto): Promise<Family> {
    const family = await this.familyRepository.findOneById(id);

    if (!family) {
      throw new NotFoundException('family not found');
    }

    if (updateFamilyDto.familyBookNumber) {
      const existingFamily = await this.findOneByFamilyBookNumber(updateFamilyDto.familyBookNumber);

      if (existingFamily && existingFamily.id !== id) {
        throw new ConflictException('Family book number already exists for another family');
      }
    }

    const updatedFamily = this.familyRepository.merge(family, updateFamilyDto);
    return this.familyRepository.save(updatedFamily);
  }

  async delete(id: number): Promise<void> {
    const result = await this.familyRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException('family not found');
    }
  }

  // private methods
  private findOneByFamilyBookNumber(familyBookNumber: string): Promise<Family | undefined> {
    return this.familyRepository.findOneBy({ familyBookNumber });
  }
}
