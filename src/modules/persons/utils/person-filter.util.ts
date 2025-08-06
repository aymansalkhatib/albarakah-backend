import { SelectQueryBuilder } from 'typeorm';
import { Person } from '../entities/person.entity';
import { FilterPersonDto } from '../dtos/queries/filter-person.dto';

export function applyPersonFilters(
  qb: SelectQueryBuilder<any>,
  alias: string,
  filter: FilterPersonDto,
): SelectQueryBuilder<Person> {
  if (filter.firstName) {
    qb.andWhere(`${alias}.firstName ILIKE :firstName`, {
      firstName: `%${filter.firstName}%`,
    });
  }

  if (filter.lastName) {
    qb.andWhere(`${alias}.lastName ILIKE :lastName`, {
      lastName: `%${filter.lastName}%`,
    });
  }

  if (filter.fatherName) {
    qb.andWhere(`${alias}.fatherName ILIKE :fatherName`, {
      fatherName: `%${filter.fatherName}%`,
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

  if (filter.nationality) {
    qb.andWhere(`${alias}.nationality ILIKE :nationality`, {
      nationality: `%${filter.nationality}%`,
    });
  }

  if (filter.birthPlace) {
    qb.andWhere(`${alias}.birthPlace ILIKE :birthPlace`, {
      birthPlace: `%${filter.birthPlace}%`,
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

  if (filter.isSmoker !== undefined) {
    qb.andWhere(`${alias}.isSmoker = :isSmoker`, {
      isSmoker: filter.isSmoker,
    });
  }

  if (filter.healthStatusId) {
    qb.andWhere(`${alias}.healthStatusId = :healthStatusId`, {
      healthStatusId: filter.healthStatusId,
    });
  }

  if (filter.educationLevelId) {
    qb.andWhere(`${alias}.educationLevelId = :educationLevelId`, {
      educationLevelId: filter.educationLevelId,
    });
  }

  if (filter.schoolTypeId) {
    qb.andWhere(`${alias}.schoolTypeId = :schoolTypeId`, {
      schoolTypeId: filter.schoolTypeId,
    });
  }

  if (filter.personStatusId) {
    qb.andWhere(`${alias}.personStatusId = :personStatusId`, {
      personStatusId: filter.personStatusId,
    });
  }

  if (filter.maritalStatusId) {
    qb.andWhere(`${alias}.maritalStatusId = :maritalStatusId`, {
      maritalStatusId: filter.maritalStatusId,
    });
  }

  if (filter.gradeLevelId) {
    qb.andWhere(`${alias}.gradeLevelId = :gradeLevelId`, {
      gradeLevelId: filter.gradeLevelId,
    });
  }

  if (filter.universityMajor) {
    qb.andWhere(`${alias}.universityMajor ILIKE :universityMajor`, {
      universityMajor: `%${filter.universityMajor}%`,
    });
  }

  if (filter.email) {
    qb.andWhere(`${alias}.email ILIKE :email`, {
      email: `%${filter.email}%`,
    });
  }

  if (filter.phone) {
    qb.andWhere(`${alias}.phone ILIKE :phone`, {
      phone: `%${filter.phone}%`,
    });
  }

  if (filter.address) {
    qb.andWhere(`${alias}.address ILIKE :address`, {
      address: `%${filter.address}%`,
    });
  }

  if (filter.shoeSize) {
    qb.andWhere(`${alias}.shoeSize = :shoeSize`, {
      shoeSize: filter.shoeSize,
    });
  }

  if (filter.clothingSize) {
    qb.andWhere(`${alias}.clothingSize = :clothingSize`, {
      clothingSize: filter.clothingSize,
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
