import { SelectQueryBuilder } from 'typeorm';
import { FilterSupporterDto } from '../dtos/queries/filter-supporter.dto';
import { Supporter } from '../entities/supporters.entity';

export function applySupporterFilters(
  qb: SelectQueryBuilder<any>,
  alias: string,
  filter: FilterSupporterDto,
): SelectQueryBuilder<Supporter> {
  if (filter.supportType) {
    qb.andWhere(`${alias}.supportType = :supportType`, {
      supportType: filter.supportType,
    });
  }

  if (filter.supportStartDateFrom) {
    qb.andWhere(`${alias}.supportStartDate >= :from`, {
      from: filter.supportStartDateFrom,
    });
  }

  if (filter.supportStartDateTo) {
    qb.andWhere(`${alias}.supportStartDate <= :to`, {
      to: filter.supportStartDateTo,
    });
  }

  if (filter.supportEndDateFrom) {
    qb.andWhere(`${alias}.supportEndDate >= :from`, {
      from: filter.supportEndDateFrom,
    });
  }

  if (filter.supportEndDateTo) {
    qb.andWhere(`${alias}.supportEndDate <= :to`, {
      to: filter.supportEndDateTo,
    });
  }

  if (filter.search) {
    qb.andWhere(`${alias}.notes ILIKE :search`, { search: `%${filter.search}%` });
  }

  return qb;
}
