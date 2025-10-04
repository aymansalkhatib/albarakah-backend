import { SelectQueryBuilder } from 'typeorm';
import { FilterSupporterDto } from '../dtos/queries/filter-supporter.dto';
import { Supporter } from '../entities/supporters.entity';

export function applySupporterFilters(
  qb: SelectQueryBuilder<any>,
  alias: string,
  filter: FilterSupporterDto,
): SelectQueryBuilder<Supporter> {
  if (filter.address) {
    qb.andWhere(`${alias}.address ILIKE :address`, {
      address: `%${filter.address}%`,
    });
  }

  if (filter.sponsorshipType) {
    qb.andWhere(`${alias}.sponsorshipType = :sponsorshipType`, {
      sponsorshipType: filter.sponsorshipType,
    });
  }

  if (filter.paymentCycle) {
    qb.andWhere(`${alias}.paymentCycle = :paymentCycle`, {
      paymentCycle: filter.paymentCycle,
    });
  }

  if (filter.sponsorshipAmount) {
    qb.andWhere(`${alias}.sponsorshipAmount = :sponsorshipAmount`, {
      sponsorshipAmount: filter.sponsorshipAmount,
    });
  }

  if (filter.authorizedPersonName) {
    qb.andWhere(`${alias}.authorizedPersonName ILIKE :authorizedPersonName`, {
      authorizedPersonName: `%${filter.authorizedPersonName}%`,
    });
  }

  if (filter.authorizedPersonPhone) {
    qb.andWhere(`${alias}.authorizedPersonPhone ILIKE :authorizedPersonPhone`, {
      authorizedPersonPhone: `%${filter.authorizedPersonPhone}%`,
    });
  }

  if (filter.notes) {
    qb.andWhere(`${alias}.notes ILIKE :notes`, {
      notes: `%${filter.notes}%`,
    });
  }

  return qb;
}
