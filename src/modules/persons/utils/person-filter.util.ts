import { SelectQueryBuilder } from 'typeorm';
import { FilterPersonDto } from '../dtos/queries/filter-person.dto';
import { Person } from '../entities/person.entity';

export function applyPersonFilters(
  qb: SelectQueryBuilder<any>,
  alias: string,
  filter: FilterPersonDto,
): SelectQueryBuilder<Person> {
  if (filter.fullName) {
    qb.andWhere(`${alias}.fullName ILIKE :fullName`, {
      fullName: `%${filter.fullName}%`,
    });
  }

  if (filter.motherName) {
    qb.andWhere(`${alias}.motherName ILIKE :motherName`, {
      motherName: `%${filter.motherName}%`,
    });
  }

  if (filter.nationalId) {
    qb.andWhere(`${alias}.nationalId ILIKE :nationalId`, {
      nationalId: `%${filter.nationalId}%`,
    });
  }

  if (filter.nationality) {
    qb.andWhere(`${alias}.nationality ILIKE :nationality`, {
      nationality: `%${filter.nationality}%`,
    });
  }

  if (filter.motherNationality) {
    qb.andWhere(`${alias}.motherNationality ILIKE :motherNationality`, {
      motherNationality: `%${filter.motherNationality}%`,
    });
  }

  if (filter.isPalestinian !== undefined) {
    qb.andWhere(`${alias}.isPalestinian = :isPalestinian`, {
      isPalestinian: filter.isPalestinian,
    });
  }

  if (filter.gender) {
    qb.andWhere(`${alias}.gender = :gender`, {
      gender: filter.gender,
    });
  }

  if (filter.shoeSize) {
    qb.andWhere(`${alias}.shoeSize = :shoeSize`, {
      shoeSize: filter.shoeSize,
    });
  }

  if (filter.maritalStatus) {
    qb.andWhere(`${alias}.maritalStatus = :maritalStatus`, {
      maritalStatus: filter.maritalStatus,
    });
  }

  if (filter.isWorking !== undefined) {
    qb.andWhere(`${alias}.isWorking = :isWorking`, {
      isWorking: filter.isWorking,
    });
  }

  if (filter.currentJob) {
    qb.andWhere(`${alias}.currentJob ILIKE :currentJob`, {
      currentJob: `%${filter.currentJob}%`,
    });
  }

  if (filter.jobDetails) {
    qb.andWhere(`${alias}.jobDetails ILIKE :jobDetails`, {
      jobDetails: `%${filter.jobDetails}%`,
    });
  }

  if (filter.isSmoker !== undefined) {
    qb.andWhere(`${alias}.isSmoker = :isSmoker`, {
      isSmoker: filter.isSmoker,
    });
  }

  if (filter.healthStatus) {
    qb.andWhere(`${alias}.healthStatus ILIKE :healthStatus`, {
      healthStatus: `%${filter.healthStatus}%`,
    });
  }

  if (filter.isHealthInsuranceUsed !== undefined) {
    qb.andWhere(`${alias}.isHealthInsuranceUsed = :isHealthInsuranceUsed`, {
      isHealthInsuranceUsed: filter.isHealthInsuranceUsed,
    });
  }

  if (filter.isSuccessCertificateSubmitted) {
    qb.andWhere(
      `${alias}.isSuccessCertificateSubmitted = :isSuccessCertificateSubmitted`,
      {
        isSuccessCertificateSubmitted: filter.isSuccessCertificateSubmitted,
      },
    );
  }

  if (filter.educationLevel) {
    qb.andWhere(`${alias}.educationLevel = :educationLevel`, {
      educationLevel: filter.educationLevel,
    });
  }

  if (filter.universityMajor) {
    qb.andWhere(`${alias}.universityMajor ILIKE :universityMajor`, {
      universityMajor: `%${filter.universityMajor}%`,
    });
  }

  if (filter.currentStudyStatus) {
    qb.andWhere(`${alias}.currentStudyStatus = :currentStudyStatus`, {
      currentStudyStatus: filter.currentStudyStatus,
    });
  }

  if (filter.schoolType) {
    qb.andWhere(`${alias}.schoolType = :schoolType`, {
      schoolType: filter.schoolType,
    });
  }

  if (filter.schoolName) {
    qb.andWhere(`${alias}.schoolName ILIKE :schoolName`, {
      schoolName: `%${filter.schoolName}%`,
    });
  }

  if (filter.mobilePhone) {
    qb.andWhere(`${alias}.mobilePhone ILIKE :mobilePhone`, {
      mobilePhone: `%${filter.mobilePhone}%`,
    });
  }

  if (filter.landlinePhone) {
    qb.andWhere(`${alias}.landlinePhone ILIKE :landlinePhone`, {
      landlinePhone: `%${filter.landlinePhone}%`,
    });
  }

  if (filter.whatsappNumber) {
    qb.andWhere(`${alias}.whatsappNumber ILIKE :whatsappNumber`, {
      whatsappNumber: `%${filter.whatsappNumber}%`,
    });
  }

  if (filter.notes) {
    qb.andWhere(`${alias}.notes ILIKE :notes`, {
      notes: `%${filter.notes}%`,
    });
  }

  if (filter.birthPlace) {
    qb.andWhere(`${alias}.birthPlace ILIKE :birthPlace`, {
      birthPlace: `%${filter.birthPlace}%`,
    });
  }

  if (filter.birthDateFrom && filter.birthDateTo) {
    qb.andWhere(`${alias}.birthDate BETWEEN :birthDateFrom AND :birthDateTo`, {
      birthDateFrom: filter.birthDateFrom,
      birthDateTo: filter.birthDateTo,
    });
  } else if (filter.birthDateFrom) {
    qb.andWhere(`${alias}.birthDate >= :birthDateFrom`, {
      birthDateFrom: filter.birthDateFrom,
    });
  } else if (filter.birthDateTo) {
    qb.andWhere(`${alias}.birthDate <= :birthDateTo`, {
      birthDateTo: filter.birthDateTo,
    });
  }

  return qb;
}
