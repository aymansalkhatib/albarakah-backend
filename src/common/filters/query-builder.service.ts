import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { FilterCondition, FilterOperator } from './types';

@Injectable()
export class QueryBuilderService {
  applyFilters<T>(
    queryBuilder: SelectQueryBuilder<T>,
    conditions: FilterCondition[],
    alias: string = queryBuilder.alias,
  ): SelectQueryBuilder<T> {
    conditions.forEach((condition, index) => {
      const paramName = `param_${index}`;
      const fieldName = `${alias}.${condition.field}`;

      switch (condition.operator) {
        case FilterOperator.EQUALS:
          queryBuilder.andWhere(`${fieldName} = :${paramName}`, {
            [paramName]: condition.value,
          });
          break;

        case FilterOperator.NOT_EQUALS:
          queryBuilder.andWhere(`${fieldName} != :${paramName}`, {
            [paramName]: condition.value,
          });
          break;

        case FilterOperator.GREATER_THAN:
          queryBuilder.andWhere(`${fieldName} > :${paramName}`, {
            [paramName]: condition.value,
          });
          break;

        case FilterOperator.GREATER_THAN_OR_EQUAL:
          queryBuilder.andWhere(`${fieldName} >= :${paramName}`, {
            [paramName]: condition.value,
          });
          break;

        case FilterOperator.LESS_THAN:
          queryBuilder.andWhere(`${fieldName} < :${paramName}`, {
            [paramName]: condition.value,
          });
          break;

        case FilterOperator.LESS_THAN_OR_EQUAL:
          queryBuilder.andWhere(`${fieldName} <= :${paramName}`, {
            [paramName]: condition.value,
          });
          break;

        case FilterOperator.LIKE:
          queryBuilder.andWhere(`${fieldName} LIKE :${paramName}`, {
            [paramName]: `%${condition.value}%`,
          });
          break;

        case FilterOperator.ILIKE:
          queryBuilder.andWhere(`${fieldName} ILIKE :${paramName}`, {
            [paramName]: `%${condition.value}%`,
          });
          break;

        case FilterOperator.CONTAINS:
          queryBuilder.andWhere(`${fieldName} ILIKE :${paramName}`, {
            [paramName]: `%${condition.value}%`,
          });
          break;

        case FilterOperator.STARTS_WITH:
          queryBuilder.andWhere(`${fieldName} ILIKE :${paramName}`, {
            [paramName]: `${condition.value}%`,
          });
          break;

        case FilterOperator.ENDS_WITH:
          queryBuilder.andWhere(`${fieldName} ILIKE :${paramName}`, {
            [paramName]: `%${condition.value}`,
          });
          break;

        case FilterOperator.IN:
          const inValues = condition.values || [condition.value];
          queryBuilder.andWhere(`${fieldName} IN (:...${paramName})`, {
            [paramName]: inValues,
          });
          break;

        case FilterOperator.NOT_IN:
          const notInValues = condition.values || [condition.value];
          queryBuilder.andWhere(`${fieldName} NOT IN (:...${paramName})`, {
            [paramName]: notInValues,
          });
          break;

        case FilterOperator.IS_NULL:
          queryBuilder.andWhere(`${fieldName} IS NULL`);
          break;

        case FilterOperator.IS_NOT_NULL:
          queryBuilder.andWhere(`${fieldName} IS NOT NULL`);
          break;

        case FilterOperator.BETWEEN:
          const betweenValues = Array.isArray(condition.value)
            ? condition.value
            : [condition.value];
          if (betweenValues.length === 2) {
            queryBuilder.andWhere(`${fieldName} BETWEEN :${paramName}0 AND :${paramName}1`, {
              [`${paramName}0`]: betweenValues[0],
              [`${paramName}1`]: betweenValues[1],
            });
          }
          break;
      }
    });

    return queryBuilder;
  }

  applyPagination<T>(
    queryBuilder: SelectQueryBuilder<T>,
    page: number = 1,
    limit: number = 10,
  ): SelectQueryBuilder<T> {
    const offset = (page - 1) * limit;
    return queryBuilder.skip(offset).take(limit);
  }

  applySorting<T>(
    queryBuilder: SelectQueryBuilder<T>,
    sortBy?: string,
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    alias: string = queryBuilder.alias,
  ): SelectQueryBuilder<T> {
    if (sortBy) {
      queryBuilder.orderBy(`${alias}.${sortBy}`, sortOrder);
    }
    return queryBuilder;
  }
}
