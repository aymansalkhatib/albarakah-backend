import { SelectQueryBuilder } from 'typeorm';
import { Family } from '../entities/families.entity';
import { FilterFamilyDto } from '../dtos/queries/filter-family.dto';

export function applyFamilyFilters(
  qb: SelectQueryBuilder<any>,
  alias: string,
  filter: FilterFamilyDto,
): SelectQueryBuilder<Family> {
  // String filters with case-insensitive search
  if (filter.familyName) {
    qb.andWhere(`${alias}.familyName ILIKE :familyName`, {
      familyName: `%${filter.familyName}%`,
    });
  }

  if (filter.familyBookNumber) {
    qb.andWhere(`${alias}.familyBookNumber ILIKE :familyBookNumber`, {
      familyBookNumber: `%${filter.familyBookNumber}%`,
    });
  }

  if (filter.landlinePhone) {
    qb.andWhere(`${alias}.landlinePhone ILIKE :landlinePhone`, {
      landlinePhone: `%${filter.landlinePhone}%`,
    });
  }

  if (filter.suspensionReason) {
    qb.andWhere(`${alias}.suspensionReason ILIKE :suspensionReason`, {
      suspensionReason: `%${filter.suspensionReason}%`,
    });
  }

  if (filter.notes) {
    qb.andWhere(`${alias}.notes ILIKE :notes`, {
      notes: `%${filter.notes}%`,
    });
  }

  // Boolean filters (explicit check for undefined to allow false values)
  if (filter.isDisplaced !== undefined) {
    qb.andWhere(`${alias}.isDisplaced = :isDisplaced`, {
      isDisplaced: filter.isDisplaced,
    });
  }

  if (filter.isExtremelyPoor !== undefined) {
    qb.andWhere(`${alias}.isExtremelyPoor = :isExtremelyPoor`, {
      isExtremelyPoor: filter.isExtremelyPoor,
    });
  }

  if (filter.motherIsTrainingBeneficiary !== undefined) {
    qb.andWhere(`${alias}.motherIsTrainingBeneficiary = :motherIsTrainingBeneficiary`, {
      motherIsTrainingBeneficiary: filter.motherIsTrainingBeneficiary,
    });
  }

  // Numeric range filters
  if (filter.minVoucherAmount !== undefined && filter.maxVoucherAmount !== undefined) {
    qb.andWhere(`${alias}.voucherAmount BETWEEN :minVoucherAmount AND :maxVoucherAmount`, {
      minVoucherAmount: filter.minVoucherAmount,
      maxVoucherAmount: filter.maxVoucherAmount,
    });
  } else if (filter.minVoucherAmount !== undefined) {
    qb.andWhere(`${alias}.voucherAmount >= :minVoucherAmount`, {
      minVoucherAmount: filter.minVoucherAmount,
    });
  } else if (filter.maxVoucherAmount !== undefined) {
    qb.andWhere(`${alias}.voucherAmount <= :maxVoucherAmount`, {
      maxVoucherAmount: filter.maxVoucherAmount,
    });
  }

  if (
    filter.minChildrenSchoolExpenses !== undefined &&
    filter.maxChildrenSchoolExpenses !== undefined
  ) {
    qb.andWhere(
      `${alias}.childrenSchoolExpenses BETWEEN :minChildrenSchoolExpenses AND :maxChildrenSchoolExpenses`,
      {
        minChildrenSchoolExpenses: filter.minChildrenSchoolExpenses,
        maxChildrenSchoolExpenses: filter.maxChildrenSchoolExpenses,
      },
    );
  } else if (filter.minChildrenSchoolExpenses !== undefined) {
    qb.andWhere(`${alias}.childrenSchoolExpenses >= :minChildrenSchoolExpenses`, {
      minChildrenSchoolExpenses: filter.minChildrenSchoolExpenses,
    });
  } else if (filter.maxChildrenSchoolExpenses !== undefined) {
    qb.andWhere(`${alias}.childrenSchoolExpenses <= :maxChildrenSchoolExpenses`, {
      maxChildrenSchoolExpenses: filter.maxChildrenSchoolExpenses,
    });
  }

  if (
    filter.minIncomeFromBarakaAssociation !== undefined &&
    filter.maxIncomeFromBarakaAssociation !== undefined
  ) {
    qb.andWhere(
      `${alias}.incomeFromBarakaAssociation BETWEEN :minIncomeFromBarakaAssociation AND :maxIncomeFromBarakaAssociation`,
      {
        minIncomeFromBarakaAssociation: filter.minIncomeFromBarakaAssociation,
        maxIncomeFromBarakaAssociation: filter.maxIncomeFromBarakaAssociation,
      },
    );
  } else if (filter.minIncomeFromBarakaAssociation !== undefined) {
    qb.andWhere(`${alias}.incomeFromBarakaAssociation >= :minIncomeFromBarakaAssociation`, {
      minIncomeFromBarakaAssociation: filter.minIncomeFromBarakaAssociation,
    });
  } else if (filter.maxIncomeFromBarakaAssociation !== undefined) {
    qb.andWhere(`${alias}.incomeFromBarakaAssociation <= :maxIncomeFromBarakaAssociation`, {
      maxIncomeFromBarakaAssociation: filter.maxIncomeFromBarakaAssociation,
    });
  }

  // Date range filters
  if (filter.familySuspensionDateFrom && filter.familySuspensionDateTo) {
    qb.andWhere(
      `${alias}.familySuspensionDate BETWEEN :familySuspensionDateFrom AND :familySuspensionDateTo`,
      {
        familySuspensionDateFrom: filter.familySuspensionDateFrom,
        familySuspensionDateTo: filter.familySuspensionDateTo,
      },
    );
  } else if (filter.familySuspensionDateFrom) {
    qb.andWhere(`${alias}.familySuspensionDate >= :familySuspensionDateFrom`, {
      familySuspensionDateFrom: filter.familySuspensionDateFrom,
    });
  } else if (filter.familySuspensionDateTo) {
    qb.andWhere(`${alias}.familySuspensionDate <= :familySuspensionDateTo`, {
      familySuspensionDateTo: filter.familySuspensionDateTo,
    });
  }

  if (filter.registrationDateFrom && filter.registrationDateTo) {
    qb.andWhere(`${alias}.registrationDate BETWEEN :registrationDateFrom AND :registrationDateTo`, {
      registrationDateFrom: filter.registrationDateFrom,
      registrationDateTo: filter.registrationDateTo,
    });
  } else if (filter.registrationDateFrom) {
    qb.andWhere(`${alias}.registrationDate >= :registrationDateFrom`, {
      registrationDateFrom: filter.registrationDateFrom,
    });
  } else if (filter.registrationDateTo) {
    qb.andWhere(`${alias}.registrationDate <= :registrationDateTo`, {
      registrationDateTo: filter.registrationDateTo,
    });
  }

  if (filter.lastAssessmentDateFrom && filter.lastAssessmentDateTo) {
    qb.andWhere(
      `${alias}.lastAssessmentDate BETWEEN :lastAssessmentDateFrom AND :lastAssessmentDateTo`,
      {
        lastAssessmentDateFrom: filter.lastAssessmentDateFrom,
        lastAssessmentDateTo: filter.lastAssessmentDateTo,
      },
    );
  } else if (filter.lastAssessmentDateFrom) {
    qb.andWhere(`${alias}.lastAssessmentDate >= :lastAssessmentDateFrom`, {
      lastAssessmentDateFrom: filter.lastAssessmentDateFrom,
    });
  } else if (filter.lastAssessmentDateTo) {
    qb.andWhere(`${alias}.lastAssessmentDate <= :lastAssessmentDateTo`, {
      lastAssessmentDateTo: filter.lastAssessmentDateTo,
    });
  }

  return qb;
}
