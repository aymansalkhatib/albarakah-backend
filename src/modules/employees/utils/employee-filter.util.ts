import { SelectQueryBuilder } from 'typeorm';
import { FilterEmployeeDto } from '../dtos/queries/filter-employee.dto';
import { Employee } from '../entities/employee.entity';

export function applyEmployeeFilters(
  qb: SelectQueryBuilder<any>,
  alias: string,
  filter: FilterEmployeeDto,
): SelectQueryBuilder<Employee> {
  if (filter.position) {
    qb.andWhere(`${alias}.position ILIKE :position`, {
      position: `%${filter.position}%`,
    });
  }

  if (filter.username) {
    qb.andWhere(`${alias}.username ILIKE :username`, {
      username: `%${filter.username}%`,
    });
  }

  if (filter.hireDateFrom && filter.hireDateTo) {
    qb.andWhere(`${alias}.hireDate BETWEEN :hireDateFrom AND :hireDateTo`, {
      hireDateFrom: filter.hireDateFrom,
      hireDateTo: filter.hireDateTo,
    });
  } else if (filter.hireDateFrom) {
    qb.andWhere(`${alias}.hireDate >= :hireDateFrom`, {
      hireDateFrom: filter.hireDateFrom,
    });
  } else if (filter.hireDateTo) {
    qb.andWhere(`${alias}.hireDate <= :hireDateTo`, {
      hireDateTo: filter.hireDateTo,
    });
  }

  if (filter.terminationDateFrom && filter.terminationDateTo) {
    qb.andWhere(
      `${alias}.terminationDate BETWEEN :terminationDateFrom AND :terminationDateTo`,
      {
        terminationDateFrom: filter.terminationDateFrom,
        terminationDateTo: filter.terminationDateTo,
      },
    );
  } else if (filter.terminationDateFrom) {
    qb.andWhere(`${alias}.terminationDate >= :terminationDateFrom`, {
      terminationDateFrom: filter.terminationDateFrom,
    });
  } else if (filter.terminationDateTo) {
    qb.andWhere(`${alias}.terminationDate <= :terminationDateTo`, {
      terminationDateTo: filter.terminationDateTo,
    });
  }

  if (filter.search) {
    qb.andWhere(
      `(
        ${alias}.position ILIKE :search OR
        ${alias}.username ILIKE :search OR
        COALESCE(${alias}.notes, '') ILIKE :search
      )`,
      { search: `%${filter.search}%` },
    );
  }

  // Filter by active status (based on termination date)
  if (filter.isActive != null) {
    if (filter.isActive) {
      qb.andWhere(`${alias}.terminationDate IS NULL`);
    } else {
      qb.andWhere(`${alias}.terminationDate IS NOT NULL`);
    }
  }

  return qb;
}
