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

  if (filter.residencePlace) {
    qb.andWhere(`${alias}.residencePlace ILIKE :residencePlace`, {
      residencePlace: `%${filter.residencePlace}%`,
    });
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

  return qb;
}
