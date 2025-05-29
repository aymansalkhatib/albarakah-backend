import { Injectable } from '@nestjs/common';
import { FilterCondition, FilterOperator, QueryParams } from './types';

@Injectable()
export class FilterParserService {
  parseQueryParams(query: QueryParams): FilterCondition[] {
    const conditions: FilterCondition[] = [];
    const excludedKeys = ['page', 'limit', 'sortBy', 'sortOrder'];

    for (const [key, value] of Object.entries(query)) {
      if (excludedKeys.includes(key) || value === undefined || value === '') {
        continue;
      }

      // Handle operator-based filtering: field[operator]=value
      const operatorMatch = key.match(/^(.+)\[(\w+)\]$/);
      if (operatorMatch) {
        const [, field, operatorStr] = operatorMatch;
        const operator = this.getOperatorFromString(operatorStr);

        if (operator) {
          conditions.push({
            field,
            operator,
            value: this.parseValue(value, operator),
          });
        }
        continue;
      }

      // Handle array values for IN operations
      if (Array.isArray(value)) {
        conditions.push({
          field: key,
          operator: FilterOperator.IN,
          values: value,
        });
        continue;
      }

      // Handle comma-separated values as IN operation
      if (typeof value === 'string' && value.includes(',')) {
        conditions.push({
          field: key,
          operator: FilterOperator.IN,
          values: value.split(',').map((v) => v.trim()),
        });
        continue;
      }

      // Default equality check
      conditions.push({
        field: key,
        operator: FilterOperator.EQUALS,
        value: this.parseValue(value),
      });
    }

    return conditions;
  }

  private getOperatorFromString(operatorStr: string): FilterOperator | null {
    const operatorMap: Record<string, FilterOperator> = {
      eq: FilterOperator.EQUALS,
      ne: FilterOperator.NOT_EQUALS,
      gt: FilterOperator.GREATER_THAN,
      gte: FilterOperator.GREATER_THAN_OR_EQUAL,
      lt: FilterOperator.LESS_THAN,
      lte: FilterOperator.LESS_THAN_OR_EQUAL,
      like: FilterOperator.LIKE,
      ilike: FilterOperator.ILIKE,
      in: FilterOperator.IN,
      nin: FilterOperator.NOT_IN,
      null: FilterOperator.IS_NULL,
      not_null: FilterOperator.IS_NOT_NULL,
      between: FilterOperator.BETWEEN,
      contains: FilterOperator.CONTAINS,
      starts_with: FilterOperator.STARTS_WITH,
      ends_with: FilterOperator.ENDS_WITH,
    };

    return operatorMap[operatorStr] || null;
  }

  private parseValue(value: any, operator?: FilterOperator): any {
    if (operator === FilterOperator.IN || operator === FilterOperator.NOT_IN) {
      if (typeof value === 'string') {
        return value.split(',').map((v) => v.trim());
      }
      return Array.isArray(value) ? value : [value];
    }

    if (operator === FilterOperator.BETWEEN) {
      if (typeof value === 'string') {
        const parts = value.split(',');
        return parts.length === 2 ? parts : value;
      }
      return value;
    }

    // Try to parse as number
    if (typeof value === 'string' && !isNaN(Number(value))) {
      return Number(value);
    }

    // Try to parse as boolean
    if (value === 'true') return true;
    if (value === 'false') return false;

    // Try to parse as date
    if (typeof value === 'string' && !isNaN(Date.parse(value))) {
      return new Date(value);
    }

    return value;
  }
}
