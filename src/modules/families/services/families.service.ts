import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateFamilyDto } from '../dtos/requests/update-family-dto';
import { Family } from '../entities/families.entity';
import { CreateFamilyDto } from '../dtos/requests/create-family-dto';
import { FilterFamilyDto } from '../dtos/queries/filter-family.dto';
import {
  Between,
  FindOptionsWhere,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

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

  async findAll(filter: FilterFamilyDto): Promise<Family[]> {
    const where = this.buildWhereClause(filter);
    return this.familyRepository.find({ where });
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

  private buildWhereClause(filter: FilterFamilyDto): any {
    const where: FindOptionsWhere<Family> = {};

    // String filters with case-insensitive search
    if (filter.familyName) {
      where.familyName = ILike(`%${filter.familyName}%`);
    }

    if (filter.familyBookNumber) {
      where.familyBookNumber = ILike(`%${filter.familyBookNumber}%`);
    }

    if (filter.landlinePhone) {
      where.landlinePhone = ILike(`%${filter.landlinePhone}%`);
    }

    if (filter.suspensionReason) {
      where.suspensionReason = ILike(`%${filter.suspensionReason}%`);
    }

    if (filter.notes) {
      where.notes = ILike(`%${filter.notes}%`);
    }

    // Boolean filters (explicit check for undefined to allow false values)
    if (filter.isDisplaced !== undefined) {
      where.isDisplaced = filter.isDisplaced;
    }

    if (filter.isExtremelyPoor !== undefined) {
      where.isExtremelyPoor = filter.isExtremelyPoor;
    }

    if (filter.motherIsTrainingBeneficiary !== undefined) {
      where.motherIsTrainingBeneficiary = filter.motherIsTrainingBeneficiary;
    }

    // Numeric range filters
    this.applyRangeFilter(where, 'voucherAmount', filter.minVoucherAmount, filter.maxVoucherAmount);
    this.applyRangeFilter(
      where,
      'childrenSchoolExpenses',
      filter.minChildrenSchoolExpenses,
      filter.maxChildrenSchoolExpenses,
    );
    this.applyRangeFilter(
      where,
      'incomeFromBarakaAssociation',
      filter.minIncomeFromBarakaAssociation,
      filter.maxIncomeFromBarakaAssociation,
    );

    // Date range filters
    this.applyRangeFilter(
      where,
      'familySuspensionDate',
      filter.familySuspensionDateFrom,
      filter.familySuspensionDateTo,
    );
    this.applyRangeFilter(
      where,
      'registrationDate',
      filter.registrationDateFrom,
      filter.registrationDateTo,
    );
    this.applyRangeFilter(
      where,
      'lastAssessmentDate',
      filter.lastAssessmentDateFrom,
      filter.lastAssessmentDateTo,
    );

    return where;
  }

  private applyRangeFilter(
    where: any,
    field: string,
    min?: number | Date,
    max?: number | Date,
  ): void {
    if (min !== undefined && max !== undefined) {
      where[field] = Between(min, max);
    } else if (min !== undefined) {
      where[field] = MoreThanOrEqual(min);
    } else if (max !== undefined) {
      where[field] = LessThanOrEqual(max);
    }
  }
}
