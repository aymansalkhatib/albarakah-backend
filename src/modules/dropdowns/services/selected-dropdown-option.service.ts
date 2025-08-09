import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SelectedDropdownOption } from '../entities/selected-dropdown-option.entity';
import { CreateSelectedDropdownOptionDto } from '../dtos/selected-dropdown-option/create-selected-dropdown-option.dto';
import { DropdownService } from './dropdown.service';
import { DropdownOptionService } from './dropdown-option.service';
import { DropdownSelectionType } from '../entities/dropdown.entity';
import { DropdownCategoryService } from './dropdown-category.service';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';

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
    const category = await this.dropdownCategoryService.ensureExists(createDto.categoryId);

    const dropdown = await this.dropdownService.ensureExists(createDto.dropdownId);

    if (category.id !== dropdown.dropdownCategoryId) {
      throw new BadRequestException(
        this.translateHelper.tr('dropdowns.errors.category_mismatch', {
          categoryId: category.id,
          dropdownCategoryId: dropdown.dropdownCategoryId,
        }),
      );
    }

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
}
