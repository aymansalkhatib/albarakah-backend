import {
  PaginationOptions,
  PaginationResult,
} from 'src/shared/pagination/dto/interfaces/pagination.interface';
import { SelectQueryBuilder } from 'typeorm';

export class QueryBuilderUtil {
  /**
   * Apply pagination and sorting to a QueryBuilder
   */
  static applyPaginationAndSort<T>(
    queryBuilder: SelectQueryBuilder<T>,
    options: PaginationOptions,
    allowedSortFields: string[] = [],
    defaultSort: { field: string; order: 'ASC' | 'DESC' } = { field: 'id', order: 'ASC' },
  ): SelectQueryBuilder<T> {
    // Apply sorting
    if (options.sort && options.sort.length > 0) {
      options.sort.forEach((sortItem, index) => {
        // Validate sort field if allowedSortFields is provided
        if (allowedSortFields.length > 0 && !allowedSortFields.includes(sortItem.field)) {
          return; // Skip invalid sort field
        }

        const alias = queryBuilder.alias || 'entity';
        const fieldName = `${alias}.${sortItem.field}`;

        if (index === 0) {
          queryBuilder.orderBy(fieldName, sortItem.order);
        } else {
          queryBuilder.addOrderBy(fieldName, sortItem.order);
        }
      });
    } else {
      // Apply default sorting
      const alias = queryBuilder.alias || 'entity';
      queryBuilder.orderBy(`${alias}.${defaultSort.field}`, defaultSort.order);
    }

    // Apply pagination
    const skip = (options.page - 1) * options.limit;
    queryBuilder.skip(skip).take(options.limit);

    return queryBuilder;
  }

  /**
   * Execute paginated query and return formatted result
   */
  static async executePaginatedQuery<T>(
    queryBuilder: SelectQueryBuilder<T>,
    options: PaginationOptions,
  ): Promise<PaginationResult<T>> {
    const [data, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / options.limit);
    const hasNextPage = options.page < totalPages;
    const hasPreviousPage = options.page > 1;

    return {
      data,
      meta: {
        total,
        page: options.page,
        limit: options.limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  /**
   * Complete pagination with sorting - combines apply and execute
   */
  static async paginate<T>(
    queryBuilder: SelectQueryBuilder<T>,
    options: PaginationOptions,
    allowedSortFields: string[] = [],
    defaultSort: { field: string; order: 'ASC' | 'DESC' } = { field: 'id', order: 'ASC' },
  ): Promise<PaginationResult<T>> {
    const paginatedQuery = this.applyPaginationAndSort(
      queryBuilder,
      options,
      allowedSortFields,
      defaultSort,
    );

    return this.executePaginatedQuery(paginatedQuery, options);
  }
}
