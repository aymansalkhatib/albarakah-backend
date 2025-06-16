import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DropdownCategory } from '../entities/dropdown-category.entity';
import { FilterDropdownCategoryDto } from '../dto/filter-dropdown-category.dto';
import { PaginationOptions, PaginationResult } from '../../../shared/pagination/dto/interfaces/pagination.interface';
import { QueryBuilderUtil } from '../../../utils/query-builder.util';

@Injectable()
export class DropdownCategoryRepository extends Repository<DropdownCategory> {
  constructor(private dataSource: DataSource) {
    super(DropdownCategory, dataSource.createEntityManager());
  }

  async findAllPaginated(
    filter: FilterDropdownCategoryDto,
    paginationOptions: PaginationOptions,
  ): Promise<PaginationResult<DropdownCategory>> {
    const queryBuilder = this.createQueryBuilder('category');

    if (filter.name) {
      queryBuilder.andWhere('category.name LIKE :name', { name: `%${filter.name}%` });
    }

    if (filter.parentId !== undefined) {
      if (filter.parentId === null) {
        queryBuilder.andWhere('category.parentId IS NULL');
      } else {
        queryBuilder.andWhere('category.parentId = :parentId', { parentId: filter.parentId });
      }
    }

    // Add relations
    queryBuilder.leftJoinAndSelect('category.parent', 'parent');
    queryBuilder.leftJoinAndSelect('category.children', 'children');

    const allowedSortFields = ['id', 'name', 'createdAt'];
    return QueryBuilderUtil.paginate(queryBuilder, paginationOptions, allowedSortFields);
  }

  async findWithRelations(id: number): Promise<DropdownCategory> {
    return this.createQueryBuilder('category')
      .leftJoinAndSelect('category.parent', 'parent')
      .leftJoinAndSelect('category.children', 'children')
      .where('category.id = :id', { id })
      .getOne();
  }

  async findRootCategories(): Promise<DropdownCategory[]> {
    return this.createQueryBuilder('category')
      .where('category.parentId IS NULL')
      .leftJoinAndSelect('category.children', 'children')
      .getMany();
  }

  async findCategoryTree(): Promise<DropdownCategory[]> {
    const roots = await this.findRootCategories();
    return roots;
  }
}