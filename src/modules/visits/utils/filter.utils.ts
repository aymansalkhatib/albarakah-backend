import { SelectQueryBuilder } from 'typeorm';
import { FilterVisitDto } from '../dtos/queries/filter-visit.dto';

export function applyVisitFilters(
  queryBuilder: SelectQueryBuilder<any>,
  filter: FilterVisitDto,
): void {
  // Family ID filter
  if (filter.familyId) {
    queryBuilder.andWhere('visit.familyId = :familyId', {
      familyId: filter.familyId,
    });
  }

  // Visit date range filters
  if (filter.visitDateFrom && filter.visitDateTo) {
    queryBuilder.andWhere(
      'visit.visitDate BETWEEN :visitDateFrom AND :visitDateTo',
      {
        visitDateFrom: filter.visitDateFrom,
        visitDateTo: filter.visitDateTo,
      },
    );
  } else if (filter.visitDateFrom) {
    queryBuilder.andWhere('visit.visitDate >= :visitDateFrom', {
      visitDateFrom: filter.visitDateFrom,
    });
  } else if (filter.visitDateTo) {
    queryBuilder.andWhere('visit.visitDate <= :visitDateTo', {
      visitDateTo: filter.visitDateTo,
    });
  }

  // Paper sent date range filters
  if (filter.paperSentDateFrom && filter.paperSentDateTo) {
    queryBuilder.andWhere(
      'visit.paperSentDateOfTheVisit BETWEEN :paperSentDateFrom AND :paperSentDateTo',
      {
        paperSentDateFrom: filter.paperSentDateFrom,
        paperSentDateTo: filter.paperSentDateTo,
      },
    );
  } else if (filter.paperSentDateFrom) {
    queryBuilder.andWhere(
      'visit.paperSentDateOfTheVisit >= :paperSentDateFrom',
      {
        paperSentDateFrom: filter.paperSentDateFrom,
      },
    );
  } else if (filter.paperSentDateTo) {
    queryBuilder.andWhere('visit.paperSentDateOfTheVisit <= :paperSentDateTo', {
      paperSentDateTo: filter.paperSentDateTo,
    });
  }

  // Guardian relationship filter
  if (filter.guardianRelationship) {
    queryBuilder.andWhere(
      'visit.guardianRelationship = :guardianRelationship',
      {
        guardianRelationship: filter.guardianRelationship,
      },
    );
  }

  // Number of family members range filters
  if (filter.numberOfFamilyMembersMin && filter.numberOfFamilyMembersMax) {
    queryBuilder.andWhere(
      'visit.numberOfFamilyMembers BETWEEN :numberOfFamilyMembersMin AND :numberOfFamilyMembersMax',
      {
        numberOfFamilyMembersMin: filter.numberOfFamilyMembersMin,
        numberOfFamilyMembersMax: filter.numberOfFamilyMembersMax,
      },
    );
  } else if (filter.numberOfFamilyMembersMin) {
    queryBuilder.andWhere(
      'visit.numberOfFamilyMembers >= :numberOfFamilyMembersMin',
      {
        numberOfFamilyMembersMin: filter.numberOfFamilyMembersMin,
      },
    );
  } else if (filter.numberOfFamilyMembersMax) {
    queryBuilder.andWhere(
      'visit.numberOfFamilyMembers <= :numberOfFamilyMembersMax',
      {
        numberOfFamilyMembersMax: filter.numberOfFamilyMembersMax,
      },
    );
  }

  // Number of remaining family members range filters
  if (
    filter.numberOfRemainingFamilyMembersMin &&
    filter.numberOfRemainingFamilyMembersMax
  ) {
    queryBuilder.andWhere(
      'visit.numberOfRemainingFamilyMembersInTheHouse BETWEEN :numberOfRemainingFamilyMembersMin AND :numberOfRemainingFamilyMembersMax',
      {
        numberOfRemainingFamilyMembersMin:
          filter.numberOfRemainingFamilyMembersMin,
        numberOfRemainingFamilyMembersMax:
          filter.numberOfRemainingFamilyMembersMax,
      },
    );
  } else if (filter.numberOfRemainingFamilyMembersMin) {
    queryBuilder.andWhere(
      'visit.numberOfRemainingFamilyMembersInTheHouse >= :numberOfRemainingFamilyMembersMin',
      {
        numberOfRemainingFamilyMembersMin:
          filter.numberOfRemainingFamilyMembersMin,
      },
    );
  } else if (filter.numberOfRemainingFamilyMembersMax) {
    queryBuilder.andWhere(
      'visit.numberOfRemainingFamilyMembersInTheHouse <= :numberOfRemainingFamilyMembersMax',
      {
        numberOfRemainingFamilyMembersMax:
          filter.numberOfRemainingFamilyMembersMax,
      },
    );
  }

  // House condition filter
  if (filter.houseCondition) {
    queryBuilder.andWhere('visit.houseCondition = :houseCondition', {
      houseCondition: filter.houseCondition,
    });
  }

  // House ownership filter
  if (filter.houseOwnership) {
    queryBuilder.andWhere('visit.houseOwnership = :houseOwnership', {
      houseOwnership: filter.houseOwnership,
    });
  }

  // School expenses range filters
  if (filter.schoolExpensesMin && filter.schoolExpensesMax) {
    queryBuilder.andWhere(
      'visit.schoolExpenses BETWEEN :schoolExpensesMin AND :schoolExpensesMax',
      {
        schoolExpensesMin: filter.schoolExpensesMin,
        schoolExpensesMax: filter.schoolExpensesMax,
      },
    );
  } else if (filter.schoolExpensesMin) {
    queryBuilder.andWhere('visit.schoolExpenses >= :schoolExpensesMin', {
      schoolExpensesMin: filter.schoolExpensesMin,
    });
  } else if (filter.schoolExpensesMax) {
    queryBuilder.andWhere('visit.schoolExpenses <= :schoolExpensesMax', {
      schoolExpensesMax: filter.schoolExpensesMax,
    });
  }

  // Baraka association income filter
  if (filter.barakaAssociationIncome) {
    queryBuilder.andWhere(
      'visit.barakaAssociationIncome = :barakaAssociationIncome',
      {
        barakaAssociationIncome: filter.barakaAssociationIncome,
      },
    );
  }

  // Available spending range filters
  if (filter.availableSpendingMin && filter.availableSpendingMax) {
    queryBuilder.andWhere(
      'visit.availableSpendingWithoutAssociation BETWEEN :availableSpendingMin AND :availableSpendingMax',
      {
        availableSpendingMin: filter.availableSpendingMin,
        availableSpendingMax: filter.availableSpendingMax,
      },
    );
  } else if (filter.availableSpendingMin) {
    queryBuilder.andWhere(
      'visit.availableSpendingWithoutAssociation >= :availableSpendingMin',
      {
        availableSpendingMin: filter.availableSpendingMin,
      },
    );
  } else if (filter.availableSpendingMax) {
    queryBuilder.andWhere(
      'visit.availableSpendingWithoutAssociation <= :availableSpendingMax',
      {
        availableSpendingMax: filter.availableSpendingMax,
      },
    );
  }

  // Total income range filters
  if (filter.totalIncomeMin && filter.totalIncomeMax) {
    queryBuilder.andWhere(
      'visit.totalIncomeWithoutAssociation BETWEEN :totalIncomeMin AND :totalIncomeMax',
      {
        totalIncomeMin: filter.totalIncomeMin,
        totalIncomeMax: filter.totalIncomeMax,
      },
    );
  } else if (filter.totalIncomeMin) {
    queryBuilder.andWhere(
      'visit.totalIncomeWithoutAssociation >= :totalIncomeMin',
      {
        totalIncomeMin: filter.totalIncomeMin,
      },
    );
  } else if (filter.totalIncomeMax) {
    queryBuilder.andWhere(
      'visit.totalIncomeWithoutAssociation <= :totalIncomeMax',
      {
        totalIncomeMax: filter.totalIncomeMax,
      },
    );
  }

  // Rent amount range filters
  if (filter.rentAmountMin && filter.rentAmountMax) {
    queryBuilder.andWhere(
      'visit.amountOfRentIfTheApplicantIsTheOnePayingIt BETWEEN :rentAmountMin AND :rentAmountMax',
      {
        rentAmountMin: filter.rentAmountMin,
        rentAmountMax: filter.rentAmountMax,
      },
    );
  } else if (filter.rentAmountMin) {
    queryBuilder.andWhere(
      'visit.amountOfRentIfTheApplicantIsTheOnePayingIt >= :rentAmountMin',
      {
        rentAmountMin: filter.rentAmountMin,
      },
    );
  } else if (filter.rentAmountMax) {
    queryBuilder.andWhere(
      'visit.amountOfRentIfTheApplicantIsTheOnePayingIt <= :rentAmountMax',
      {
        rentAmountMax: filter.rentAmountMax,
      },
    );
  }

  // Committee member name search
  if (filter.committeeMemberName) {
    queryBuilder.andWhere('visit.committeeMembers LIKE :committeeMemberName', {
      committeeMemberName: `%${filter.committeeMemberName}%`,
    });
  }

  // Notes search
  if (filter.searchNotes) {
    queryBuilder.andWhere(
      '(visit.notes LIKE :searchNotes OR visit.committeeNotesAndSuggestionsOfTheVisitCommittee LIKE :searchNotes)',
      { searchNotes: `%${filter.searchNotes}%` },
    );
  }
}
