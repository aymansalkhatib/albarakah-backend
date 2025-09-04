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

  if (filter.notes) {
    qb.andWhere(`${alias}.notes ILIKE :notes`, {
      notes: `%${filter.notes}%`,
    });
  }

  return qb;
}
