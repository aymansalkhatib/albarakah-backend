import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Dropdown } from '../entities/dropdown.entity';
import { FilterDropdownDto } from '../dto/filter-dropdown.dto';
import { PaginationOptions, PaginationResult } from '../../../shared/pagination/dto/interfaces/pagination.interface';
import { QueryBuilderUtil } from '../../../utils/query-builder.util';

@Injectable()
export class DropdownRepository extends Repository<Dropdown> {
  constructor(private dataSource: DataSource) {
    super(Dropdown, dataSource.createEntityManager());
  }

  async findAllPaginated(
    filter: FilterDropdownDto,
    paginationOptions: PaginationOptions,
  ): Promise<PaginationResult<Dropdown>> {
    const queryBuilder = this.createQueryBuilder('dropdown');

    if (filter.dropdownName) {
      queryBuilder.andWhere('dropdown.dropdownName LIKE :name', { name: `%${filter.dropdownName}%` });
    }

    if (filter.dropdownCategoryId) {
      queryBuilder.andWhere('dropdown.dropdownCategoryId = :categoryId', {
        categoryId: filter.dropdownCategoryId,
      });
    }

    if (filter.selectionType) {
      queryBuilder.andWhere('dropdown.selectionType = :selectionType', {
        selectionType: filter.selectionType,
      });
    }

    // Add relations
    queryBuilder.leftJoinAndSelect('dropdown.dropdownCategory', 'category');
    queryBuilder.leftJoinAndSelect('dropdown.options', 'options');

    const allowedSortFields = ['id', 'dropdownName', 'createdAt'];
    return QueryBuilderUtil.paginate(queryBuilder, paginationOptions, allowedSortFields);
  }

  async findWithRelations(id: number): Promise<Dropdown> {
    return this.createQueryBuilder('dropdown')
      .leftJoinAndSelect('dropdown.dropdownCategory', 'category')
      .leftJoinAndSelect('dropdown.options', 'options')
      .where('dropdown.id = :id', { id })
      .getOne();
  }

  async findByCategory(categoryId: number): Promise<Dropdown[]> {
    return this.createQueryBuilder('dropdown')
      .leftJoinAndSelect('dropdown.options', 'options')
      .where('dropdown.dropdownCategoryId = :categoryId', { categoryId })
      .getMany();
  }
}