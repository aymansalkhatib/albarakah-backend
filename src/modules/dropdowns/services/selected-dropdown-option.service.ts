import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { paginate } from '../../../common/pagination/paginate.service';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';
import { CreateSelectedDropdownOptionDto } from '../dtos/selected-dropdown-option/create-selected-dropdown-option.dto';
import { FilterSelectedDropdownOptionDto } from '../dtos/selected-dropdown-option/filter-selected-dropdown-option.dto';
import { ResponseSelectedDropdownOptionDto } from '../dtos/selected-dropdown-option/response-selected-dropdown-option.dto';
import { DropdownCategory } from '../entities/dropdown-category.entity';
import { SelectedDropdownOption } from '../entities/selected-dropdown-option.entity';
import { DropdownSelectionType } from '../enums/dropdown-selection-type.enum';
import { DropdownCategoryService } from './dropdown-category.service';
import { DropdownOptionService } from './dropdown-option.service';
import { DropdownService } from './dropdown.service';

@Injectable()
export class SelectedDropdownOptionService {
  constructor(
    @InjectRepository(SelectedDropdownOption)
    private readonly selectedDropdownOptionRepository: Repository<SelectedDropdownOption>,
    private readonly dropdownService: DropdownService,
    private readonly dropdownOptionService: DropdownOptionService,
    private readonly dropdownCategoryService: DropdownCategoryService,
    private readonly translateHelper: TranslateHelper,
  ) {}

  async upsert(createDto: CreateSelectedDropdownOptionDto): Promise<any> {
    const category = await this.dropdownCategoryService.findOne(createDto.categoryId);

    const dropdown = await this.dropdownService.findOne(createDto.dropdownId, {
      relations: ['options'],
    });

    if (category.id !== dropdown.dropdownCategoryId) {
      throw new BadRequestException(
        this.translateHelper.tr('dropdowns.errors.category_mismatch', {
          categoryId: category.id,
          dropdownCategoryId: dropdown.dropdownCategoryId,
        }),
      );
    }

    // Validate that record type matches category root name
    await this.validateRecordTypeMatchesCategoryRoot(createDto.entityType, category);

    switch (dropdown.selectionType) {
      case DropdownSelectionType.SINGLE:
        return this.handleSingleSelectionWithTransaction(createDto);
      case DropdownSelectionType.MULTIPLE_DUPLICATED:
        return this.handleMultipleSelectionWithTransaction(createDto, true);
      case DropdownSelectionType.MULTIPLE:
        return this.handleMultipleSelectionWithTransaction(createDto, false);
      default:
        throw new BadRequestException(
          this.translateHelper.tr('dropdowns.errors.invalid_selection_type'),
        );
    }
  }

  async findOne(
    id: number,
    options: FindOneOptions<SelectedDropdownOption> = {},
  ): Promise<SelectedDropdownOption> {
    const selection = await this.selectedDropdownOptionRepository.findOne({
      where: { id },
      ...options,
    });
    if (!selection) {
      throw new NotFoundException(
        this.translateHelper.tr('dropdowns.errors.selection_not_found', { id }),
      );
    }
    return selection;
  }

  async delete(id: number): Promise<void> {
    const result = await this.selectedDropdownOptionRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(
        this.translateHelper.tr('dropdowns.errors.selection_not_found', { id }),
      );
    }
  }

  async findAll(
    filterDto: FilterSelectedDropdownOptionDto,
  ): Promise<PaginationResponseDto<ResponseSelectedDropdownOptionDto>> {
    const queryBuilder = this.selectedDropdownOptionRepository.createQueryBuilder('selection');

    // Apply filters
    if (filterDto.recordId) {
      queryBuilder.andWhere('selection.recordId = :recordId', { recordId: filterDto.recordId });
    }

    if (filterDto.entityType) {
      queryBuilder.andWhere('selection.entityType = :entityType', {
        entityType: filterDto.entityType,
      });
    }

    if (filterDto.dropdownId) {
      queryBuilder.andWhere('selection.dropdownId = :dropdownId', {
        dropdownId: filterDto.dropdownId,
      });
    }

    if (filterDto.categoryId) {
      queryBuilder.andWhere('selection.categoryId = :categoryId', {
        categoryId: filterDto.categoryId,
      });
    }

    if (filterDto.selectedOptionId) {
      queryBuilder.andWhere('selection.selectedOptionId = :selectedOptionId', {
        selectedOptionId: filterDto.selectedOptionId,
      });
    }

    return paginate(queryBuilder, filterDto, ResponseSelectedDropdownOptionDto);
  }

  private async handleSingleSelectionWithTransaction(
    createDto: CreateSelectedDropdownOptionDto,
  ): Promise<SelectedDropdownOption> {
    // For single selection, only one option can be selected per record
    if (createDto.selectedOptionId.length !== 1) {
      throw new BadRequestException(
        this.translateHelper.tr('dropdowns.errors.single_selection_requires_one_option'),
      );
    }

    // Check if option exists and belongs to the dropdown
    await this.dropdownOptionService.findOne(createDto.selectedOptionId[0]);

    // Check if there's already a selection for this record and dropdown
    const existingSelection = await this.selectedDropdownOptionRepository
      .createQueryBuilder('selection')
      .where('selection.recordId = :recordId', { recordId: createDto.recordId })
      .andWhere('selection.entityType = :entityType', { entityType: createDto.entityType })
      .andWhere('selection.dropdownId = :dropdownId', { dropdownId: createDto.dropdownId })
      .andWhere('selection.categoryId = :categoryId', { categoryId: createDto.categoryId })
      .getOne();

    if (existingSelection) {
      // Update existing selection
      existingSelection.selectedOptionId = createDto.selectedOptionId[0];
      existingSelection.categoryId = createDto.categoryId;
      existingSelection.dropdownId = createDto.dropdownId;
      existingSelection.entityType = createDto.entityType;
      existingSelection.recordId = createDto.recordId;

      return this.selectedDropdownOptionRepository.save(existingSelection);
    } else {
      // Create new selection
      const selection = this.selectedDropdownOptionRepository.create({
        recordId: createDto.recordId,
        entityType: createDto.entityType,
        dropdownId: createDto.dropdownId,
        categoryId: createDto.categoryId,
        selectedOptionId: createDto.selectedOptionId[0],
      });
      return this.selectedDropdownOptionRepository.save(selection);
    }
  }

  private async handleMultipleSelectionWithTransaction(
    createDto: CreateSelectedDropdownOptionDto,
    canDublicated: boolean,
  ): Promise<SelectedDropdownOption[]> {
    if (!canDublicated) {
      // Check if there are any duplicate IDs in the selectedOptionId array
      const uniqueIds = new Set(createDto.selectedOptionId);
      if (uniqueIds.size !== createDto.selectedOptionId.length) {
        throw new BadRequestException(
          this.translateHelper.tr('dropdowns.errors.duplicate_options_not_allowed'),
        );
      }
    }

    // Check if all options exist and belong to the dropdown
    for (const optionId of createDto.selectedOptionId) {
      await this.dropdownOptionService.findOne(optionId);
    }

    // Remove existing selections for this record and dropdown
    await this.selectedDropdownOptionRepository
      .createQueryBuilder()
      .delete()
      .from(SelectedDropdownOption)
      .where('recordId = :recordId', { recordId: createDto.recordId })
      .andWhere('entityType = :entityType', { entityType: createDto.entityType })
      .andWhere('dropdownId = :dropdownId', { dropdownId: createDto.dropdownId })
      .andWhere('categoryId = :categoryId', { categoryId: createDto.categoryId })
      .execute();

    // Create new selections for each selected option
    const selections: SelectedDropdownOption[] = [];
    for (const optionId of createDto.selectedOptionId) {
      const selection = this.selectedDropdownOptionRepository.create({
        recordId: createDto.recordId,
        entityType: createDto.entityType,
        dropdownId: createDto.dropdownId,
        categoryId: createDto.categoryId,
        selectedOptionId: optionId,
      });
      selections.push(selection);
    }

    return this.selectedDropdownOptionRepository.save(selections);
  }

  private async validateRecordTypeMatchesCategoryRoot(
    entityType: string,
    category: DropdownCategory,
  ): Promise<void> {
    // Get the root category (category with depth = 1)
    let rootCategory = category;
    while (rootCategory.parentId) {
      rootCategory = await this.dropdownCategoryService.findOne(rootCategory.parentId);
    }

    // Check if the root category name matches the entity type
    if (rootCategory.name !== entityType) {
      throw new BadRequestException(
        this.translateHelper.tr('dropdowns.errors.category_mismatch', {
          categoryId: rootCategory.name,
          dropdownCategoryId: entityType,
        }),
      );
    }
  }
}
