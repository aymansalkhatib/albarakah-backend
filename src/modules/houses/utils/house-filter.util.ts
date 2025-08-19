import { SelectQueryBuilder } from 'typeorm';
import { HouseQueryDto } from '../dtos';
import { House } from '../entities/house.entity';

export function applyHouseFilters(
  qb: SelectQueryBuilder<House>,
  alias: string,
  query: HouseQueryDto,
): SelectQueryBuilder<House> {
  if (query.familyId) {
    qb.andWhere(`${alias}.familyId = :familyId`, { familyId: query.familyId });
  }

  if (query.locationText) {
    qb.andWhere(`${alias}.locationText ILIKE :locationText`, {
      locationText: `%${query.locationText}%`,
    });
  }

  if (query.isRented !== undefined) {
    qb.andWhere(`${alias}.isRented = :isRented`, { isRented: query.isRented });
  }

  if (query.minRentAmount !== undefined) {
    qb.andWhere(`${alias}.rentAmount >= :minRentAmount`, {
      minRentAmount: query.minRentAmount,
    });
  }

  if (query.maxRentAmount !== undefined) {
    qb.andWhere(`${alias}.rentAmount <= :maxRentAmount`, {
      maxRentAmount: query.maxRentAmount,
    });
  }

  return qb;
}
