import { BaseFilter } from './base-filter.interface';
import { AdvancedFilter } from './advanced-filter.interface';
import { SortOption } from './sort-option.interface';
import { PaginationOptions } from './pagination-options.interface';

export interface FilterQuery {
  filters?: BaseFilter[];
  advancedFilter?: AdvancedFilter;
  sort?: SortOption[];
  pagination?: PaginationOptions;
  search?: string;
  searchFields?: string[];
}
