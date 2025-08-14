import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDropdownCategoryDto } from '../dtos/dropdown-category/create-dropdown-category.dto';
import { UpdateDropdownCategoryDto } from '../dtos/dropdown-category/update-dropdown-category.dto';
import { DropdownCategory } from '../entities/dropdown-category.entity';

import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterDropdownCategoryDto } from '../dtos/dropdown-category/filter-dropdown-category.dto';
import { paginate } from '../../../common/pagination/paginate.service';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { ResponseDropdownCategoryDto } from '../dtos/dropdown-category/response-dropdown-category.dto';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';
import { House } from '@app/modules/houses/entities/house.entity';
import { Person } from '@app/modules/persons/entities/person.entity';

@Injectable()
export class DropdownCategoryService {
  constructor(
    @InjectRepository(DropdownCategory)
    private readonly dropdownCategoryRepository: Repository<DropdownCategory>,
    private readonly translateHelper: TranslateHelper,
  ) {}

  async create(createDto: CreateDropdownCategoryDto): Promise<DropdownCategory> {
    // Check if parent exists and validate rules if parentId is provided
    let parentCategory: DropdownCategory;

    if (createDto.parentId) {
      parentCategory = await this.dropdownCategoryRepository.findOne({
        where: { id: createDto.parentId },
        relations: ['dropdowns'],
      });

      if (!parentCategory) {
        throw new BadRequestException(
          this.translateHelper.tr('dropdowns.errors.category_not_found', {
            id: createDto.parentId,
          }),
        );
      }

      // Additional check using canCreateSubcategory method
      if (!(await parentCategory.canCreateSubcategory())) {
        throw new BadRequestException(
          this.translateHelper.tr('dropdowns.errors.cannot_create_subcategory'),
        );
      }
    }

    await this.checkDuplicateCategoryName(createDto.name, createDto.parentId);

    // Create the category - BeforeInsert hook will handle depth calculation and validation
    const category = this.dropdownCategoryRepository.create(createDto);
    const savedCategory = await this.dropdownCategoryRepository.save(category);

    // Update parent category states if parent exists

    if (parentCategory) await parentCategory.updateEnableStates();

    return savedCategory;
  }

  async update(id: number, updateDto: UpdateDropdownCategoryDto): Promise<DropdownCategory> {
    const category = await this.findOne(id);
    await this.checkDuplicateCategoryName(updateDto.name, category.parentId);
    this.dropdownCategoryRepository.merge(category, updateDto);
    return this.dropdownCategoryRepository.save(category);
  }

  async delete(id: number): Promise<void> {
    const category = await this.findOne(id, { relations: ['dropdowns', 'children'] });
    
    if (category.name == House.name || category.name == Person.name) {
      throw new BadRequestException(
        this.translateHelper.tr('dropdowns.errors.cannot_delete_core_category'),
      );
    }

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

    await this.dropdownCategoryRepository.delete(category.id);
  }

  async findOne(
    id: number,
    options: FindOneOptions<DropdownCategory> = {},
  ): Promise<DropdownCategory> {
    const category = await this.dropdownCategoryRepository.findOne({
      where: { id },
      ...options,
    });

    if (!category) {
      throw new NotFoundException(
        this.translateHelper.tr('dropdowns.errors.category_not_found', { id }),
      );
    }
    return category;
  }

  async findAll(
    filter: FilterDropdownCategoryDto,
  ): Promise<PaginationResponseDto<ResponseDropdownCategoryDto>> {
    const qb = this.dropdownCategoryRepository.createQueryBuilder('category');

    if (filter.name) {
      qb.andWhere('LOWER(category.name) LIKE LOWER(:name)', {
        name: `%${filter.name}%`,
      });
    }

    if (filter.parentId !== undefined) {
      if (filter.parentId === null) {
        qb.andWhere('category.parentId IS NULL');
      } else {
        qb.andWhere('category.parentId = :parentId', { parentId: filter.parentId });
      }
    }
    return paginate(qb, filter, ResponseDropdownCategoryDto);
  }

  private async checkDuplicateCategoryName(name: string, parentId: number | null): Promise<void> {
    const existingCategory = await this.dropdownCategoryRepository.findOne({
      where: {
        name,
        parentId,
      },
    });
    if (existingCategory) {
      throw new BadRequestException(
        this.translateHelper.tr('dropdowns.errors.category_name_exists', {
          name,
        }),
      );
    }
  }
}
