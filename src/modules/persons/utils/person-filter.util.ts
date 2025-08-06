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

  if (filter.nationalId) {
    qb.andWhere(`${alias}.nationalId ILIKE :nationalId`, {
      nationalId: `%${filter.nationalId}%`,
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

  return qb;
}
