import {
  Between,
  DeleteResult,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { FilterBeneficiaryFamilyDto } from './dto/filter-beneficiary-family.dto';
import { BeneficiaryFamily } from './entities/beneficiary-families.entity';
import { CreateBeneficiaryFamilyDto } from './dto/create-beneficiary-family-dto';
import { UpdateBeneficiaryFamilyDto } from './dto/update-beneficiary-family-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BeneficiaryFamilyRepository extends Repository<BeneficiaryFamily> {
  constructor(
    @InjectRepository(BeneficiaryFamily)
    private readonly repository: Repository<BeneficiaryFamily>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findAll(filter: FilterBeneficiaryFamilyDto): Promise<BeneficiaryFamily[]> {
    const whereClause = this.buildWhereClause(filter);

    return this.find({
      where: whereClause,
      order: {
        registrationDate: 'DESC',
      },
    });
  }

  findOneByFamilyBookNumber(familyBookNumber: string): Promise<BeneficiaryFamily | undefined> {
    return this.findOneBy({ familyBookNumber });
  }

  async findOneById(
    id: number,
    options: { withDeleted?: boolean } = {},
  ): Promise<BeneficiaryFamily | undefined> {
    const { withDeleted = false } = options;
    return this.findOne({ where: { id }, withDeleted });
  }

  createBeneficiaryFamily(
    createBeneficiaryFamilyDto: CreateBeneficiaryFamilyDto,
  ): Promise<BeneficiaryFamily> {
    const beneficiaryFamily = this.create(createBeneficiaryFamilyDto);
    return this.save(beneficiaryFamily);
  }

  updateBeneficiaryFamily(
    oldBeneficiaryFamily: BeneficiaryFamily,
    updateBeneficiaryFamilyDto: UpdateBeneficiaryFamilyDto,
  ): Promise<BeneficiaryFamily> {
    const updatedFamily = this.merge(oldBeneficiaryFamily, updateBeneficiaryFamilyDto);
    return this.save(updatedFamily);
  }

  forceDelete(id: number): Promise<DeleteResult> {
    return this.delete(id);
  }

  //

  private buildWhereClause(filter: FilterBeneficiaryFamilyDto): any {
    const where: any = {};

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

    if (filter.mobilePhone) {
      where.mobilePhone = ILike(`%${filter.mobilePhone}%`);
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
    this.addRangeFilter(where, 'voucherAmount', filter.minVoucherAmount, filter.maxVoucherAmount);
    this.addRangeFilter(
      where,
      'childrenSchoolExpenses',
      filter.minChildrenSchoolExpenses,
      filter.maxChildrenSchoolExpenses,
    );
    this.addRangeFilter(
      where,
      'incomeFromBarakaAssociation',
      filter.minIncomeFromBarakaAssociation,
      filter.maxIncomeFromBarakaAssociation,
    );

    // Date range filters
    this.addDateRangeFilter(
      where,
      'familySuspensionDate',
      filter.familySuspensionDateFrom,
      filter.familySuspensionDateTo,
    );
    this.addDateRangeFilter(
      where,
      'registrationDate',
      filter.registrationDateFrom,
      filter.registrationDateTo,
    );
    this.addDateRangeFilter(
      where,
      'lastAssessmentDate',
      filter.lastAssessmentDateFrom,
      filter.lastAssessmentDateTo,
    );

    return where;
  }

  private addRangeFilter(where: any, field: string, min?: number, max?: number): void {
    if (min !== undefined && max !== undefined) {
      where[field] = Between(min, max);
    } else if (min !== undefined) {
      where[field] = MoreThanOrEqual(min);
    } else if (max !== undefined) {
      where[field] = LessThanOrEqual(max);
    }
  }

  private addDateRangeFilter(where: any, field: string, from?: string, to?: string): void {
    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);

      // Validate dates
      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        throw new Error(`Invalid date format for ${field}`);
      }

      // Ensure 'from' date is not after 'to' date
      if (fromDate > toDate) {
        throw new Error(`Start date cannot be after end date for ${field}`);
      }
      where[field] = Between(fromDate, toDate);
    } else if (from) {
      const fromDate = new Date(from);
      if (isNaN(fromDate.getTime())) {
        throw new Error(`Invalid date format for ${field} start date`);
      }
      where[field] = MoreThanOrEqual(fromDate);
    } else if (to) {
      const toDate = new Date(to);
      if (isNaN(toDate.getTime())) {
        throw new Error(`Invalid date format for ${field} end date`);
      }
      where[field] = LessThanOrEqual(toDate);
    }
  }
}
