export interface PaginationOptions {
  page: number;
  limit: number;
  sort?: Array<{ field: string; order: 'ASC' | 'DESC' }>;
}

export interface PaginationResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
