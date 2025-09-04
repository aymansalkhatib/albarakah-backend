import { SelectQueryBuilder } from 'typeorm';
import { FilterEmergencyAidRequestDto } from '../dtos/queries/filter-emergency-aid-request.dto';
import { EmergencyAidRequest } from '../entities/emergency-aid-request.entity';

export function applyEmergencyAidRequestFilters(
  queryBuilder: SelectQueryBuilder<EmergencyAidRequest>,
  alias: string,
  filterDto: FilterEmergencyAidRequestDto,
): void {
  if (filterDto.familyId) {
    queryBuilder.andWhere(`${alias}.familyId = :familyId`, {
      familyId: filterDto.familyId,
    });
  }

  if (filterDto.requestStatus) {
    queryBuilder.andWhere(`${alias}.requestStatus = :requestStatus`, {
      requestStatus: filterDto.requestStatus,
    });
  }

  if (filterDto.requestedAmountFrom && filterDto.requestedAmountTo) {
    queryBuilder.andWhere(
      `${alias}.requestedAmount BETWEEN :requestedAmountFrom AND :requestedAmountTo`,
      {
        requestedAmountFrom: filterDto.requestedAmountFrom,
        requestedAmountTo: filterDto.requestedAmountTo,
      },
    );
  } else if (filterDto.requestedAmountFrom) {
    queryBuilder.andWhere(`${alias}.requestedAmount >= :requestedAmountFrom`, {
      requestedAmountFrom: filterDto.requestedAmountFrom,
    });
  } else if (filterDto.requestedAmountTo) {
    queryBuilder.andWhere(`${alias}.requestedAmount <= :requestedAmountTo`, {
      requestedAmountTo: filterDto.requestedAmountTo,
    });
  }

  if (filterDto.disbursedAmountFrom && filterDto.disbursedAmountTo) {
    queryBuilder.andWhere(
      `${alias}.disbursedAmount BETWEEN :disbursedAmountFrom AND :disbursedAmountTo`,
      {
        disbursedAmountFrom: filterDto.disbursedAmountFrom,
        disbursedAmountTo: filterDto.disbursedAmountTo,
      },
    );
  } else if (filterDto.disbursedAmountFrom) {
    queryBuilder.andWhere(`${alias}.disbursedAmount >= :disbursedAmountFrom`, {
      disbursedAmountFrom: filterDto.disbursedAmountFrom,
    });
  } else if (filterDto.disbursedAmountTo) {
    queryBuilder.andWhere(`${alias}.disbursedAmount <= :disbursedAmountTo`, {
      disbursedAmountTo: filterDto.disbursedAmountTo,
    });
  }

  if (filterDto.requestDateFrom && filterDto.requestDateTo) {
    queryBuilder.andWhere(
      `${alias}.requestDate BETWEEN :requestDateFrom AND :requestDateTo`,
      {
        requestDateFrom: filterDto.requestDateFrom,
        requestDateTo: filterDto.requestDateTo,
      },
    );
  } else if (filterDto.requestDateFrom) {
    queryBuilder.andWhere(`${alias}.requestDate >= :requestDateFrom`, {
      requestDateFrom: filterDto.requestDateFrom,
    });
  } else if (filterDto.requestDateTo) {
    queryBuilder.andWhere(`${alias}.requestDate <= :requestDateTo`, {
      requestDateTo: filterDto.requestDateTo,
    });
  }

  if (filterDto.disbursementDateFrom && filterDto.disbursementDateTo) {
    queryBuilder.andWhere(
      `${alias}.disbursementDate BETWEEN :disbursementDateFrom AND :disbursementDateTo`,
      {
        disbursementDateFrom: filterDto.disbursementDateFrom,
        disbursementDateTo: filterDto.disbursementDateTo,
      },
    );
  } else if (filterDto.disbursementDateFrom) {
    queryBuilder.andWhere(
      `${alias}.disbursementDate >= :disbursementDateFrom`,
      {
        disbursementDateFrom: filterDto.disbursementDateFrom,
      },
    );
  } else if (filterDto.disbursementDateTo) {
    queryBuilder.andWhere(`${alias}.disbursementDate <= :disbursementDateTo`, {
      disbursementDateTo: filterDto.disbursementDateTo,
    });
  }

  if (filterDto.notes) {
    queryBuilder.andWhere(`${alias}.notes ILIKE :notes`, {
      notes: `%${filterDto.notes}%`,
    });
  }
}
