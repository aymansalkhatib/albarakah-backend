import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DropdownOption } from '../entities/dropdown-option.entity';
import { PaginationOptions, PaginationResult } from '../../../shared/pagination/dto/interfaces/pagination.interface';
import { QueryBuilderUtil } from '../../../utils/query-builder.util';

@Injectable()
export class DropdownOptionRepository extends Repository<DropdownOption> {
  constructor(private dataSource: DataSource) {
    super(DropdownOption, dataSource.createEntityManager());
  }

  async findAllPaginated(
    dropdownId: number,
    paginationOptions: PaginationOptions,
  ): Promise<PaginationResult<DropdownOption>> {
    const queryBuilder = this.createQueryBuilder('option')
      .where('option.dropdownId = :dropdownId', { dropdownId })
      .leftJoinAndSelect('option.dropdown', 'dropdown');

    const allowedSortFields = ['id', 'name', 'createdAt'];
    return QueryBuilderUtil.paginate(queryBuilder, paginationOptions, allowedSortFields);
  }

  async findByDropdown(dropdownId: number): Promise<DropdownOption[]> {
    return this.createQueryBuilder('option')
      .where('option.dropdownId = :dropdownId', { dropdownId })
      .getMany();
  }
}