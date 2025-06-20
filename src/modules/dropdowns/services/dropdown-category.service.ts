import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDropdownCategoryDto } from '../dto/dropdown-category/create-dropdown-category.dto';
import { UpdateDropdownCategoryDto } from '../dto/dropdown-category/update-dropdown-category.dto';
import { DropdownCategory } from '../entities/dropdown-category.entity';
import { FilterDropdownCategoryDto } from '../dto/dropdown-category/filter-dropdown-category.dto';

import { Not, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { PaginationResponseDto } from 'src/common/pagination/dto/pagination-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'src/common/pagination/paginate.service';
import { ResponseDropdownCategoryDto } from '../dto/dropdown-category/response-dropdown-category.dto';
import { TranslateHelper } from 'src/shared/modules/app-i18n/translate.helper';

@Injectable()
export class DropdownCategoryService {
  constructor(
    @InjectRepository(DropdownCategory)
    private readonly dropdownCategoryRepository: Repository<DropdownCategory>,
    private readonly translateHelper: TranslateHelper,
  ) {}

  async create(createDto: CreateDropdownCategoryDto): Promise<DropdownCategory> {
    // Check if parent exists if parentId is provided
    if (createDto.parentId) {
      const parentExists = await this.dropdownCategoryRepository.findOne({
        where: { id: createDto.parentId },
      });
      if (!parentExists) {
        throw new BadRequestException(
          this.translateHelper.tr('dropdowns.errors.category_not_found', {
            id: createDto.parentId,
          }),
        );
      }
      const depth = await this.getCategoryDepth(createDto.parentId);
      if (depth >= 4) {
        throw new BadRequestException(
          this.translateHelper.tr('dropdowns.errors.max_depth_exceeded', { maxDepth: 4 }),
        );
      }
    }

    // Check if name is unique
    const existingCategory = await this.dropdownCategoryRepository.findOne({
      where: { name: createDto.name },
    });
    if (existingCategory) {
      throw new BadRequestException(
        this.translateHelper.tr('dropdowns.errors.category_name_exists', { name: createDto.name }),
      );
    }

    const category = this.dropdownCategoryRepository.create(createDto);
    return this.dropdownCategoryRepository.save(category);
  }

  async update(id: number, updateDto: UpdateDropdownCategoryDto): Promise<DropdownCategory> {
    const category = await this.findOne(id);

    // Check if another category (not this one) exists with the same name
    const existingCategory = await this.dropdownCategoryRepository.findOne({
      where: { name: updateDto.name, id: Not(id) },
    });
    if (existingCategory) {
      throw new BadRequestException(
        this.translateHelper.tr('dropdowns.errors.category_name_exists', { name: updateDto.name }),
      );
    }

    this.dropdownCategoryRepository.merge(category, updateDto);
    return this.dropdownCategoryRepository.save(category);
  }

  async delete(id: number): Promise<void> {
    const category = await this.findOne(id);

    if (category.dropdowns && category.dropdowns.length > 0) {
      throw new BadRequestException(
        this.translateHelper.tr('dropdowns.errors.category_has_dropdowns'),
      );
    }

    if (category.children && category.children.length > 0) {
      throw new BadRequestException(
        this.translateHelper.tr('dropdowns.errors.category_has_children'),
      );
    }

    await this.dropdownCategoryRepository.remove(category);
  }

  async findAll(
    filter: FilterDropdownCategoryDto,
  ): Promise<PaginationResponseDto<ResponseDropdownCategoryDto>> {
    const queryBuilder = this.dropdownCategoryRepository.createQueryBuilder('category');

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

    return paginate(queryBuilder, filter, ResponseDropdownCategoryDto);
  }

  async findOne(id: number): Promise<DropdownCategory> {
    const category = await this.dropdownCategoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.parent', 'parent')
      .leftJoinAndSelect('category.children', 'children')
      .leftJoinAndSelect('category.dropdowns', 'dropdowns')
      .where('category.id = :id', { id })
      .getOne();
    if (!category) {
      throw new NotFoundException(
        this.translateHelper.tr('dropdowns.errors.category_not_found', { id }),
      );
    }
    return category;
  }

  async getCategoriesTree(): Promise<DropdownCategory[]> {
    // Recursively fetch all categories and build a full tree with all descendants for each node
    const categories = await this.dropdownCategoryRepository.find({
      relations: ['parent', 'children'],
      order: { id: 'ASC' },
    });

    // Map categories by id for quick lookup
    const categoryMap = new Map<number, DropdownCategory>();
    categories.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    // Build the tree
    const roots: DropdownCategory[] = [];
    categoryMap.forEach((cat) => {
      if (cat.parentId) {
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          parent.children.push(cat);
        }
      } else {
        roots.push(cat);
      }
    });

    return roots;
  }

  async getCategoryTree(parentId?: number): Promise<DropdownCategory[]> {
    if (parentId !== undefined) {
      const query = `
     WITH RECURSIVE category_descendants AS (
       SELECT id, name, parent_id, created_at, updated_at, 0 as level
       FROM dropdown_category 
       WHERE parent_id = $1
       
       UNION ALL
       
       SELECT c.id, c.name, c.parent_id, c.created_at, c.updated_at, cd.level + 1
       FROM dropdown_category c
       INNER JOIN category_descendants cd ON c.parent_id = cd.id
     )
     SELECT * FROM category_descendants
     ORDER BY level, id
   `;

      const flatCategories = await this.dropdownCategoryRepository.query(query, [parentId]);
      return this.buildTreeFromFlat(flatCategories, parentId);
    }
    return [];
  }

  private buildTreeFromFlat(flatCategories: any[], rootParentId: number): DropdownCategory[] {
    const categoryMap = new Map<number, DropdownCategory>();

    flatCategories.forEach((cat) => {
      categoryMap.set(cat.id, {
        id: cat.id,
        name: cat.name,
        parentId: cat.parent_id,
        createdAt: cat.created_at,
        updatedAt: cat.updated_at,
        children: [],
        dropdowns: [],
      });
    });

    const roots: DropdownCategory[] = [];
    categoryMap.forEach((cat) => {
      if (cat.parentId === rootParentId) {
        roots.push(cat);
      } else {
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          parent.children.push(cat);
        }
      }
    });

    return roots;
  }

  async ensureExists(id: number): Promise<void> {
    const exists = await this.dropdownCategoryRepository.findOne({ where: { id } });
    if (!exists) {
      throw new NotFoundException(
        this.translateHelper.tr('dropdowns.errors.category_not_found', { id }),
      );
    }
  }

  private async getCategoryDepth(categoryId: number): Promise<number> {
    const query = `
      WITH RECURSIVE category_path (id, parent_id, depth) AS (
        SELECT id, parent_id, 1
        FROM dropdown_category
        WHERE id = $1
        UNION ALL
        SELECT c.id, c.parent_id, cp.depth + 1
        FROM category_path AS cp
        JOIN dropdown_category AS c ON cp.parent_id = c.id
      )
      SELECT depth FROM category_path ORDER BY depth DESC LIMIT 1;
    `;
    const result = await this.dropdownCategoryRepository.query(query, [categoryId]);
    return result.length > 0 ? parseInt(result[0].depth, 10) : 0;
  }
}
