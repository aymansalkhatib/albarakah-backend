import { SetMetadata } from '@nestjs/common';
import { FilterOperator } from './types';

export const FILTERABLE_FIELDS_KEY = 'filterable_fields';
export const SORTABLE_FIELDS_KEY = 'sortable_fields';

export interface FilterableFieldOptions {
  operators?: FilterOperator[];
  type?: 'string' | 'number' | 'date' | 'boolean' | 'enum';
  enumValues?: string[];
  relation?: string; // For nested filtering
}

export const FilterableField = (options: FilterableFieldOptions = {}) =>
  SetMetadata(FILTERABLE_FIELDS_KEY, options);

export const SortableField = () => SetMetadata(SORTABLE_FIELDS_KEY, true);
