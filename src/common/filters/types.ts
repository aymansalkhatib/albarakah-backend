export enum FilterOperator {
  EQUALS = 'eq',
  NOT_EQUALS = 'ne',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUAL = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUAL = 'lte',
  LIKE = 'like',
  ILIKE = 'ilike',
  IN = 'in',
  NOT_IN = 'nin',
  IS_NULL = 'null',
  IS_NOT_NULL = 'not_null',
  BETWEEN = 'between',
  CONTAINS = 'contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
}

export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value?: any;
  values?: any[];
}

export interface FilterQuery {
  conditions: FilterCondition[];
  logic?: 'AND' | 'OR';
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface SortQuery {
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface QueryParams extends PaginationQuery, SortQuery {
  [key: string]: any;
}

export interface FilterResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
