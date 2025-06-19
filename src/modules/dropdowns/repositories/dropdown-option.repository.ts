// import { Injectable } from '@nestjs/common';
// import { DataSource, Repository } from 'typeorm';
// import { DropdownOption } from '../entities/dropdown-option.entity';
// import { PaginationResponseDto } from 'src/common/pagination/dto/pagination-response.dto';
// import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
// import { paginate } from 'src/common/pagination/paginate.service';

// @Injectable()
// export class DropdownOptionRepository extends Repository<DropdownOption> {
//   constructor(private dataSource: DataSource) {
//     super(DropdownOption, dataSource.createEntityManager());
//   }

//   async findAllPaginated(
//     dropdownId: number,
//     paginationDto: PaginationDto,
//   ): Promise<PaginationResponseDto<DropdownOption>> {
//     const queryBuilder = this.createQueryBuilder('option')
//       .where('option.dropdownId = :dropdownId', { dropdownId })
//       .leftJoinAndSelect('option.dropdown', 'dropdown');

//     return paginate(queryBuilder, paginationDto, DropdownOption);
//   }

//   async findByDropdown(dropdownId: number): Promise<DropdownOption[]> {
//     return this.createQueryBuilder('option')
//       .where('option.dropdownId = :dropdownId', { dropdownId })
//       .getMany();
//   }
// }
