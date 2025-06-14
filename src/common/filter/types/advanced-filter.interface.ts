import { LogicalOperator } from '../enums';
import { BaseFilter } from './base-filter.interface';

export interface AdvancedFilter {
  logicalOperator?: LogicalOperator;
  filters: (BaseFilter | AdvancedFilter)[];
}
