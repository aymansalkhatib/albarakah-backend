import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateFamilyDto } from '../dtos/requests/update-family-dto';
import { Family } from '../entities/families.entity';
import { FamilyRepository } from '../repositories/family.repository';
import { CreateFamilyDto } from '../dtos/requests/create-family-dto';
import { FilterFamilyDto } from '../dtos/queries/filter-family.dto';

@Injectable()
export class FamiliesService {
  constructor(
    @InjectRepository(FamilyRepository)
    private readonly familyRepository: FamilyRepository,
  ) {}

  async findAll(filter: FilterFamilyDto): Promise<Family[]> {
    return this.familyRepository.findAll(filter);
  }

  async findOne(id: number): Promise<Family> {
    const family = await this.familyRepository.findOneById(id);
    if (!family) {
      throw new NotFoundException('family not found');
    }
    return family;
  }

  async create(createFamilyDto: CreateFamilyDto): Promise<Family> {
    if (createFamilyDto.familyBookNumber) {
      const existingFamily = await this.familyRepository.findOneByFamilyBookNumber(
        createFamilyDto.familyBookNumber,
      );
      if (existingFamily) {
        throw new ConflictException('Family book number already exists');
      }
    }
    return this.familyRepository.createFamily(createFamilyDto);
  }

  async update(id: number, updateFamilyDto: UpdateFamilyDto): Promise<Family> {
    const family = await this.familyRepository.findOneById(id);

    if (!family) {
      throw new NotFoundException('family not found');
    }

    if (updateFamilyDto.familyBookNumber) {
      const existingFamily = await this.familyRepository.findOneByFamilyBookNumber(
        updateFamilyDto.familyBookNumber,
      );

      if (existingFamily && existingFamily.id !== id) {
        throw new ConflictException('Family book number already exists for another family');
      }
    }

    return await this.familyRepository.updateFamily(family, updateFamilyDto);
  }

  async delete(id: number): Promise<void> {
    const result = await this.familyRepository.forceDelete(id);
    if (!result.affected) {
      throw new NotFoundException('family not found');
    }
  }
}
