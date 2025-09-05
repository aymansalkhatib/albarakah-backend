import { SelectQueryBuilder } from 'typeorm';
import { FilterFamilyDto } from '../dtos/queries/filter-family.dto';
import { Family } from '../entities/families.entity';

export function applyFamilyFilters(
  qb: SelectQueryBuilder<any>,
  alias: string,
  filter: FilterFamilyDto,
): SelectQueryBuilder<Family> {
  // String filters with case-insensitive search
  if (filter.requestNumber) {
    qb.andWhere(`${alias}.requestNumber ILIKE :requestNumber`, {
      requestNumber: `%${filter.requestNumber}%`,
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

  if (filter.mobilePhone) {
    qb.andWhere(`${alias}.mobilePhone ILIKE :mobilePhone`, {
      mobilePhone: `%${filter.mobilePhone}%`,
    });
  }

  if (filter.identityDocuments) {
    qb.andWhere(`${alias}.identityDocuments ILIKE :identityDocuments`, {
      identityDocuments: `%${filter.identityDocuments}%`,
    });
  }

  if (filter.otherOrphanAssociationName) {
    qb.andWhere(
      `${alias}.otherOrphanAssociationName ILIKE :otherOrphanAssociationName`,
      {
        otherOrphanAssociationName: `%${filter.otherOrphanAssociationName}%`,
      },
    );
  }

  if (filter.formNumber) {
    qb.andWhere(`${alias}.formNumber ILIKE :formNumber`, {
      formNumber: `%${filter.formNumber}%`,
    });
  }

  if (filter.formOrganizerNotes) {
    qb.andWhere(`${alias}.formOrganizerNotes ILIKE :formOrganizerNotes`, {
      formOrganizerNotes: `%${filter.formOrganizerNotes}%`,
    });
  }

  // Boolean filters (explicit check for undefined to allow false values)
  if (filter.isHusbandPalestinian !== undefined) {
    qb.andWhere(`${alias}.isHusbandPalestinian = :isHusbandPalestinian`, {
      isHusbandPalestinian: filter.isHusbandPalestinian,
    });
  }

  if (filter.isRegisteredInOtherOrphanAssociation !== undefined) {
    qb.andWhere(
      `${alias}.isRegisteredInOtherOrphanAssociation = :isRegisteredInOtherOrphanAssociation`,
      {
        isRegisteredInOtherOrphanAssociation:
          filter.isRegisteredInOtherOrphanAssociation,
      },
    );
  }

  if (filter.isRefugee !== undefined) {
    qb.andWhere(`${alias}.isRefugee = :isRefugee`, {
      isRefugee: filter.isRefugee,
    });
  }

  if (filter.isExtremelyPoor !== undefined) {
    qb.andWhere(`${alias}.isExtremelyPoor = :isExtremelyPoor`, {
      isExtremelyPoor: filter.isExtremelyPoor,
    });
  }

  if (filter.isStatusUpdatedAtSocialAffairs !== undefined) {
    qb.andWhere(
      `${alias}.isStatusUpdatedAtSocialAffairs = :isStatusUpdatedAtSocialAffairs`,
      {
        isStatusUpdatedAtSocialAffairs: filter.isStatusUpdatedAtSocialAffairs,
      },
    );
  }

  // Enum filters
  if (filter.formOrganizationStatus) {
    qb.andWhere(`${alias}.formOrganizationStatus = :formOrganizationStatus`, {
      formOrganizationStatus: filter.formOrganizationStatus,
    });
  }

  if (filter.managementDecision) {
    qb.andWhere(`${alias}.managementDecision = :managementDecision`, {
      managementDecision: filter.managementDecision,
    });
  }

  if (filter.archiveLocation) {
    qb.andWhere(`${alias}.archiveLocation = :archiveLocation`, {
      archiveLocation: filter.archiveLocation,
    });
  }

  if (filter.sponsorshipStatus) {
    qb.andWhere(`${alias}.sponsorshipStatus = :sponsorshipStatus`, {
      sponsorshipStatus: filter.sponsorshipStatus,
    });
  }

  // Numeric filters
  if (filter.contactedByEmployeeId) {
    qb.andWhere(`${alias}.contactedByEmployeeId = :contactedByEmployeeId`, {
      contactedByEmployeeId: filter.contactedByEmployeeId,
    });
  }

  // Date range filters
  if (filter.emailArrivalDateFrom && filter.emailArrivalDateTo) {
    qb.andWhere(
      `${alias}.emailArrivalDate BETWEEN :emailArrivalDateFrom AND :emailArrivalDateTo`,
      {
        emailArrivalDateFrom: filter.emailArrivalDateFrom,
        emailArrivalDateTo: filter.emailArrivalDateTo,
      },
    );
  } else if (filter.emailArrivalDateFrom) {
    qb.andWhere(`${alias}.emailArrivalDate >= :emailArrivalDateFrom`, {
      emailArrivalDateFrom: filter.emailArrivalDateFrom,
    });
  } else if (filter.emailArrivalDateTo) {
    qb.andWhere(`${alias}.emailArrivalDate <= :emailArrivalDateTo`, {
      emailArrivalDateTo: filter.emailArrivalDateTo,
    });
  }

  if (filter.interviewDateFrom && filter.interviewDateTo) {
    qb.andWhere(
      `${alias}.interviewDate BETWEEN :interviewDateFrom AND :interviewDateTo`,
      {
        interviewDateFrom: filter.interviewDateFrom,
        interviewDateTo: filter.interviewDateTo,
      },
    );
  } else if (filter.interviewDateFrom) {
    qb.andWhere(`${alias}.interviewDate >= :interviewDateFrom`, {
      interviewDateFrom: filter.interviewDateFrom,
    });
  } else if (filter.interviewDateTo) {
    qb.andWhere(`${alias}.interviewDate <= :interviewDateTo`, {
      interviewDateTo: filter.interviewDateTo,
    });
  }

  // Request acceptance date range filters
  if (filter.requestAcceptanceDateFrom && filter.requestAcceptanceDateTo) {
    qb.andWhere(
      `${alias}.requestAcceptanceDate BETWEEN :requestAcceptanceDateFrom AND :requestAcceptanceDateTo`,
      {
        requestAcceptanceDateFrom: filter.requestAcceptanceDateFrom,
        requestAcceptanceDateTo: filter.requestAcceptanceDateTo,
      },
    );
  } else if (filter.requestAcceptanceDateFrom) {
    qb.andWhere(
      `${alias}.requestAcceptanceDate >= :requestAcceptanceDateFrom`,
      {
        requestAcceptanceDateFrom: filter.requestAcceptanceDateFrom,
      },
    );
  } else if (filter.requestAcceptanceDateTo) {
    qb.andWhere(`${alias}.requestAcceptanceDate <= :requestAcceptanceDateTo`, {
      requestAcceptanceDateTo: filter.requestAcceptanceDateTo,
    });
  }

  // Request suspension date range filters
  if (filter.requestSuspensionDateFrom && filter.requestSuspensionDateTo) {
    qb.andWhere(
      `${alias}.requestSuspensionDate BETWEEN :requestSuspensionDateFrom AND :requestSuspensionDateTo`,
      {
        requestSuspensionDateFrom: filter.requestSuspensionDateFrom,
        requestSuspensionDateTo: filter.requestSuspensionDateTo,
      },
    );
  } else if (filter.requestSuspensionDateFrom) {
    qb.andWhere(
      `${alias}.requestSuspensionDate >= :requestSuspensionDateFrom`,
      {
        requestSuspensionDateFrom: filter.requestSuspensionDateFrom,
      },
    );
  } else if (filter.requestSuspensionDateTo) {
    qb.andWhere(`${alias}.requestSuspensionDate <= :requestSuspensionDateTo`, {
      requestSuspensionDateTo: filter.requestSuspensionDateTo,
    });
  }

  // String filters for request status
  if (filter.requestStatus) {
    qb.andWhere(`${alias}.requestStatus = :requestStatus`, {
      requestStatus: filter.requestStatus,
    });
  }

  if (filter.previousRequestStatus) {
    qb.andWhere(`${alias}.previousRequestStatus ILIKE :previousRequestStatus`, {
      previousRequestStatus: `%${filter.previousRequestStatus}%`,
    });
  }

  // Count range filters
  if (
    filter.beneficiaryFamilyMembersCountMin !== undefined &&
    filter.beneficiaryFamilyMembersCountMax !== undefined
  ) {
    qb.andWhere(
      `${alias}.beneficiaryFamilyMembersCount BETWEEN :beneficiaryFamilyMembersCountMin AND :beneficiaryFamilyMembersCountMax`,
      {
        beneficiaryFamilyMembersCountMin:
          filter.beneficiaryFamilyMembersCountMin,
        beneficiaryFamilyMembersCountMax:
          filter.beneficiaryFamilyMembersCountMax,
      },
    );
  } else if (filter.beneficiaryFamilyMembersCountMin !== undefined) {
    qb.andWhere(
      `${alias}.beneficiaryFamilyMembersCount >= :beneficiaryFamilyMembersCountMin`,
      {
        beneficiaryFamilyMembersCountMin:
          filter.beneficiaryFamilyMembersCountMin,
      },
    );
  } else if (filter.beneficiaryFamilyMembersCountMax !== undefined) {
    qb.andWhere(
      `${alias}.beneficiaryFamilyMembersCount <= :beneficiaryFamilyMembersCountMax`,
      {
        beneficiaryFamilyMembersCountMax:
          filter.beneficiaryFamilyMembersCountMax,
      },
    );
  }

  if (
    filter.guardianFamilyMembersCountMin !== undefined &&
    filter.guardianFamilyMembersCountMax !== undefined
  ) {
    qb.andWhere(
      `${alias}.guardianFamilyMembersCount BETWEEN :guardianFamilyMembersCountMin AND :guardianFamilyMembersCountMax`,
      {
        guardianFamilyMembersCountMin: filter.guardianFamilyMembersCountMin,
        guardianFamilyMembersCountMax: filter.guardianFamilyMembersCountMax,
      },
    );
  } else if (filter.guardianFamilyMembersCountMin !== undefined) {
    qb.andWhere(
      `${alias}.guardianFamilyMembersCount >= :guardianFamilyMembersCountMin`,
      {
        guardianFamilyMembersCountMin: filter.guardianFamilyMembersCountMin,
      },
    );
  } else if (filter.guardianFamilyMembersCountMax !== undefined) {
    qb.andWhere(
      `${alias}.guardianFamilyMembersCount <= :guardianFamilyMembersCountMax`,
      {
        guardianFamilyMembersCountMax: filter.guardianFamilyMembersCountMax,
      },
    );
  }

  if (
    filter.sharedMealMembersCountMin !== undefined &&
    filter.sharedMealMembersCountMax !== undefined
  ) {
    qb.andWhere(
      `${alias}.sharedMealMembersCount BETWEEN :sharedMealMembersCountMin AND :sharedMealMembersCountMax`,
      {
        sharedMealMembersCountMin: filter.sharedMealMembersCountMin,
        sharedMealMembersCountMax: filter.sharedMealMembersCountMax,
      },
    );
  } else if (filter.sharedMealMembersCountMin !== undefined) {
    qb.andWhere(
      `${alias}.sharedMealMembersCount >= :sharedMealMembersCountMin`,
      {
        sharedMealMembersCountMin: filter.sharedMealMembersCountMin,
      },
    );
  } else if (filter.sharedMealMembersCountMax !== undefined) {
    qb.andWhere(
      `${alias}.sharedMealMembersCount <= :sharedMealMembersCountMax`,
      {
        sharedMealMembersCountMax: filter.sharedMealMembersCountMax,
      },
    );
  }

  // Voucher value filter
  if (filter.voucherValue) {
    qb.andWhere(`${alias}.voucherValue = :voucherValue`, {
      voucherValue: filter.voucherValue,
    });
  }

  // House type filter
  if (filter.houseType) {
    qb.andWhere(`${alias}.houseType = :houseType`, {
      houseType: filter.houseType,
    });
  }

  // Current residence address filter
  if (filter.currentResidenceAddress) {
    qb.andWhere(
      `${alias}.currentResidenceAddress ILIKE :currentResidenceAddress`,
      {
        currentResidenceAddress: `%${filter.currentResidenceAddress}%`,
      },
    );
  }

  // Current residence area filter
  if (filter.currentResidenceArea) {
    qb.andWhere(`${alias}.currentResidenceArea ILIKE :currentResidenceArea`, {
      currentResidenceArea: `%${filter.currentResidenceArea}%`,
    });
  }

  return qb;
}
