// import { Injectable } from '@nestjs/common';
// import { DataSource, Repository } from 'typeorm';
// import { DropdownCategory } from '../entities/dropdown-category.entity';
// import { FilterDropdownCategoryDto } from '../dto/filter-dropdown-category.dto';
// import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
// import { PaginationResponseDto } from 'src/common/pagination/dto/pagination-response.dto';
// import { paginate } from 'src/common/pagination/paginate.service';

// @Injectable()
// export class DropdownCategoryRepository extends Repository<DropdownCategory> {
//   constructor(private dataSource: DataSource) {
//     super(DropdownCategory, dataSource.createEntityManager());
//   }

//   async findAllPaginated(
//     filter: FilterDropdownCategoryDto,
//     paginationDto: PaginationDto,
//   ): Promise<PaginationResponseDto<DropdownCategory>> {
//     const queryBuilder = this.createQueryBuilder('category');

//     if (filter.name) {
//       queryBuilder.andWhere('category.name LIKE :name', { name: `%${filter.name}%` });
//     }

//     if (filter.parentId !== undefined) {
//       if (filter.parentId === null) {
//         queryBuilder.andWhere('category.parentId IS NULL');
//       } else {
//         queryBuilder.andWhere('category.parentId = :parentId', { parentId: filter.parentId });
//       }
//     }

//     // Add relations
//     queryBuilder.leftJoinAndSelect('category.parent', 'parent');
//     queryBuilder.leftJoinAndSelect('category.children', 'children');

//      return paginate(queryBuilder, paginationDto, DropdownCategory);
//   }

//   async findWithRelations(id: number): Promise<DropdownCategory> {
//     return this.createQueryBuilder('category')
//       .leftJoinAndSelect('category.parent', 'parent')
//       .leftJoinAndSelect('category.children', 'children')
//       .where('category.id = :id', { id })
//       .getOne();
//   }

//   async findRootCategories(): Promise<DropdownCategory[]> {
//     return this.createQueryBuilder('category')
//       .where('category.parentId IS NULL')
//       .leftJoinAndSelect('category.children', 'children')
//       .getMany();
//   }

//   async findCategoryTree(): Promise<DropdownCategory[]> {
//     const roots = await this.findRootCategories();
//     return roots;
//   }
// }
