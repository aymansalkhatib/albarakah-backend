import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SelectedDropdownOption } from '../entities/selected-dropdown-option.entity';
import { CreateSelectedDropdownOptionDto } from '../dtos/selected-dropdown-option/create-selected-dropdown-option.dto';
import { UpdateSelectedDropdownOptionDto } from '../dtos/selected-dropdown-option/update-selected-dropdown-option.dto';
import { FilterSelectedDropdownOptionDto } from '../dtos/selected-dropdown-option/filter-selected-dropdown-option.dto';
import { ResponseSelectedDropdownOptionDto } from '../dtos/selected-dropdown-option/response-selected-dropdown-option.dto';
import { PaginationResponseDto } from 'src/common/pagination/dto/pagination-response.dto';
import { paginate } from 'src/common/pagination/paginate.service';
import { TranslateHelper } from 'src/shared/modules/app-i18n/translate.helper';
import { DropdownService } from './dropdown.service';
import { DropdownOptionService } from './dropdown-option.service';

@Injectable()
export class SelectedDropdownOptionService {
  constructor(
    @InjectRepository(SelectedDropdownOption)
    private readonly selectedDropdownOptionRepository: Repository<SelectedDropdownOption>,
    private readonly dropdownService: DropdownService,
    private readonly dropdownOptionService: DropdownOptionService,
    private readonly translateHelper: TranslateHelper,
  ) {}

  async create(createDto: CreateSelectedDropdownOptionDto): Promise<SelectedDropdownOption> {
    // Validate dropdown exists
    await this.dropdownService.ensureExists(createDto.dropdownId);

    // Validate option exists and belongs to the dropdown
    const option = await this.dropdownOptionService.findOne(createDto.selectedOptionId);
    if (option.dropdownId !== createDto.dropdownId) {
      throw new BadRequestException(
        this.translateHelper.tr('dropdowns.errors.option_not_in_dropdown', {
          optionId: createDto.selectedOptionId,
          dropdownId: createDto.dropdownId,
        }),
      );
    }

    // Check if option is active
    if (!option.isActive) {
      throw new BadRequestException(
        this.translateHelper.tr('selected-dropdown-options.errors.inactive_option'),
      );
    }

    // Check for existing selection for single selection dropdowns
    const dropdown = await this.dropdownService.findOne(createDto.dropdownId);
    if (dropdown.selectionType === 'single' && !dropdown.allowDuplicates) {
      const existingSelection = await this.selectedDropdownOptionRepository.findOne({
        where: {
          recordId: createDto.recordId,
          recordType: createDto.recordType,
          dropdownId: createDto.dropdownId,
        },
      });

      if (existingSelection) {
        throw new BadRequestException(
          this.translateHelper.tr('dropdowns.errors.single_selection_exists'),
        );
      }
    }

    const selection = this.selectedDropdownOptionRepository.create(createDto);
    return this.selectedDropdownOptionRepository.save(selection);
  }

  async update(
    id: number,
    updateDto: UpdateSelectedDropdownOptionDto,
  ): Promise<SelectedDropdownOption> {
    const selection = await this.findOne(id);

    if (updateDto.selectedOptionId && updateDto.selectedOptionId !== selection.selectedOptionId) {
      // Validate new option exists and belongs to the same dropdown
      const option = await this.dropdownOptionService.findOne(updateDto.selectedOptionId);
      if (option.dropdownId !== selection.dropdownId) {
        throw new BadRequestException(
          this.translateHelper.tr('dropdowns.errors.option_not_in_dropdown', {
            optionId: updateDto.selectedOptionId,
            dropdownId: selection.dropdownId,
          }),
        );
      }

      // Check if option is active
      if (!option.isActive) {
        throw new BadRequestException(
          this.translateHelper.tr('selected-dropdown-options.errors.inactive_option'),
        );
      }
    }

    const update = this.selectedDropdownOptionRepository.merge(selection, updateDto);
    return this.selectedDropdownOptionRepository.save(update);
  }

  async delete(id: number): Promise<void> {
    const selection = await this.findOne(id);
    await this.selectedDropdownOptionRepository.delete(id);
  }

  findAll(
    filter: FilterSelectedDropdownOptionDto,
  ): Promise<PaginationResponseDto<ResponseSelectedDropdownOptionDto>> {
    const queryBuilder = this.selectedDropdownOptionRepository
      .createQueryBuilder('selection')
      .leftJoinAndSelect('selection.dropdown', 'dropdown')
      .leftJoinAndSelect('selection.selectedOption', 'selectedOption');

    if (filter.recordId) {
      queryBuilder.andWhere('selection.recordId = :recordId', { recordId: filter.recordId });
    }
    if (filter.recordType) {
      queryBuilder.andWhere('selection.recordType = :recordType', {
        recordType: filter.recordType,
      });
    }
    if (filter.dropdownId) {
      queryBuilder.andWhere('selection.dropdownId = :dropdownId', {
        dropdownId: filter.dropdownId,
      });
    }
    if (filter.selectedOptionId) {
      queryBuilder.andWhere('selection.selectedOptionId = :selectedOptionId', {
        selectedOptionId: filter.selectedOptionId,
      });
    }

    return paginate(queryBuilder, filter, ResponseSelectedDropdownOptionDto);
  }

  async findOne(id: number): Promise<SelectedDropdownOption> {
    const selection = await this.selectedDropdownOptionRepository
      .createQueryBuilder('selection')
      .leftJoinAndSelect('selection.dropdown', 'dropdown')
      .leftJoinAndSelect('selection.selectedOption', 'selectedOption')
      .where('selection.id = :id', { id })
      .getOne();

    if (!selection) {
      throw new NotFoundException(
        this.translateHelper.tr('selected-dropdown-options.errors.selection_not_found', { id }),
      );
    }
    return selection;
  }

  async findByRecord(recordId: number, recordType: string): Promise<SelectedDropdownOption[]> {
    return this.selectedDropdownOptionRepository
      .createQueryBuilder('selection')
      .leftJoinAndSelect('selection.dropdown', 'dropdown')
      .leftJoinAndSelect('selection.selectedOption', 'selectedOption')
      .where('selection.recordId = :recordId', { recordId })
      .andWhere('selection.recordType = :recordType', { recordType })
      .getMany();
  }

  async deleteByRecord(recordId: number, recordType: string): Promise<void> {
    await this.selectedDropdownOptionRepository.delete({
      recordId,
      recordType,
    });
  }

  async bulkCreate(
    recordId: number,
    recordType: string,
    selections: CreateSelectedDropdownOptionDto[],
  ): Promise<SelectedDropdownOption[]> {
    // Delete existing selections for this record
    await this.deleteByRecord(recordId, recordType);

    // Create new selections
    const createdSelections: SelectedDropdownOption[] = [];
    for (const selection of selections) {
      selection.recordId = recordId;
      selection.recordType = recordType;
      const created = await this.create(selection);
      createdSelections.push(created);
    }

    return createdSelections;
  }
}
