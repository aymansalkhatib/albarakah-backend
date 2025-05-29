import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FilterParserService } from './filter-parser.service';
import { QueryBuilderService } from './query-builder.service';
import { FilterResult, QueryParams } from './types';

@Injectable()
export class GenericFilterService {
  constructor(
    private readonly filterParser: FilterParserService,
    private readonly queryBuilder: QueryBuilderService,
  ) {}

  async findWithFilters<T>(
    repository: Repository<T>,
    queryParams: QueryParams,
    relations: string[] = [],
    alias?: string,
  ): Promise<FilterResult<T>> {
    const { page = 1, limit = 10, sortBy, sortOrder = 'ASC', ...filterParams } = queryParams;

    // Parse filter conditions
    const conditions = this.filterParser.parseQueryParams(filterParams);

    // Create query builder
    const entityAlias = alias || repository.metadata.tableName;
    let queryBuilder = repository.createQueryBuilder(entityAlias);

    // Add relations
    relations.forEach((relation) => {
      queryBuilder = queryBuilder.leftJoinAndSelect(`${entityAlias}.${relation}`, relation);
    });

    // Apply filters
    queryBuilder = this.queryBuilder.applyFilters(queryBuilder, conditions, entityAlias);

    // Apply sorting
    queryBuilder = this.queryBuilder.applySorting(queryBuilder, sortBy, sortOrder, entityAlias);

    // Get total count before pagination
    const total = await queryBuilder.getCount();

    // Apply pagination
    queryBuilder = this.queryBuilder.applyPagination(queryBuilder, page, limit);

    // Execute query
    const data = await queryBuilder.getMany();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findWithCustomQuery<T>(
    queryBuilder: SelectQueryBuilder<T>,
    queryParams: QueryParams,
  ): Promise<FilterResult<T>> {
    const { page = 1, limit = 10, sortBy, sortOrder = 'ASC', ...filterParams } = queryParams;

    // Parse filter conditions
    const conditions = this.filterParser.parseQueryParams(filterParams);

    // Apply filters
    this.queryBuilder.applyFilters(queryBuilder, conditions);

    // Apply sorting
    this.queryBuilder.applySorting(queryBuilder, sortBy, sortOrder);

    // Get total count before pagination
    const total = await queryBuilder.getCount();

    // Apply pagination
    this.queryBuilder.applyPagination(queryBuilder, page, limit);

    // Execute query
    const data = await queryBuilder.getMany();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
