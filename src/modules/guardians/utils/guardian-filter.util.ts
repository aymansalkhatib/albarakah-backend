import { SelectQueryBuilder } from 'typeorm';
import { FilterGuardianDto } from '../dtos/queries/filter-guardian.dto';
import { Guardian } from '../entities/guardian.entity';

export function applyGuardianFilters(
  qb: SelectQueryBuilder<any>,
  alias: string,
  filter: FilterGuardianDto,
): SelectQueryBuilder<Guardian> {
  if (filter.relationType) {
    qb.andWhere(`${alias}.relationType = :relationType`, {
      relationType: filter.relationType,
    });
  }

  if (filter.search) {
    qb.andWhere(
      `(${alias}.firstName LIKE :search OR ${alias}.lastName LIKE :search OR ${alias}.notes LIKE :search)`,
      { search: `%${filter.search}%` },
    );
  }

  return qb;
}
