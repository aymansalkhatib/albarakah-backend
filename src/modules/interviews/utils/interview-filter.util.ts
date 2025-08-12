import { SelectQueryBuilder } from 'typeorm';
import { Interview } from '../entities/interview.entity';
import { FilterInterviewDto } from '../dtos/queries/filter-interview.dto';

export function applyInterviewFilters(
  qb: SelectQueryBuilder<any>,
  alias: string,
  filter: FilterInterviewDto,
): SelectQueryBuilder<Interview> {
  // Direct ID filters
  if (filter.familyId) {
    qb.andWhere(`${alias}.familyId = :familyId`, { familyId: filter.familyId });
  }

  if (filter.interviewerId) {
    qb.andWhere(`${alias}.interviewerId = :interviewerId`, { interviewerId: filter.interviewerId });
  }

  // String filters with case-insensitive search
  if (filter.purpose) {
    qb.andWhere(`${alias}.purpose ILIKE :purpose`, { purpose: `%${filter.purpose}%` });
  }

  if (filter.summary) {
    qb.andWhere(`${alias}.summary ILIKE :summary`, { summary: `%${filter.summary}%` });
  }

  if (filter.notes) {
    qb.andWhere(`${alias}.notes ILIKE :notes`, { notes: `%${filter.notes}%` });
  }

  // Date range filters
  if (filter.dateFrom && filter.dateTo) {
    qb.andWhere(`${alias}.interviewDate BETWEEN :dateFrom AND :dateTo`, {
      dateFrom: filter.dateFrom,
      dateTo: filter.dateTo,
    });
  } else if (filter.dateFrom) {
    qb.andWhere(`${alias}.interviewDate >= :dateFrom`, { dateFrom: filter.dateFrom });
  } else if (filter.dateTo) {
    qb.andWhere(`${alias}.interviewDate <= :dateTo`, { dateTo: filter.dateTo });
  }

  return qb;
}
