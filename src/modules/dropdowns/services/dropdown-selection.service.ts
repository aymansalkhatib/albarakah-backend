import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DropdownSelectionRepository } from '../repositories/dropdown-selection.repository';
import { CreateDropdownSelectionDto } from '../dto/create-dropdown-selection.dto';
import { DropdownSelection } from '../entities/dropdown-selection.entity';
import { DropdownRepository } from '../repositories/dropdown.repository';
import { DropdownCategoryRepository } from '../repositories/dropdown-category.repository';
import { DropdownOptionRepository } from '../repositories/dropdown-option.repository';
import { Dropdown } from '../entities/dropdown.entity';

@Injectable()
export class DropdownSelectionService {
  constructor(
    private readonly dropdownSelectionRepository: DropdownSelectionRepository,
    private readonly dropdownRepository: DropdownRepository,
    private readonly dropdownCategoryRepository: DropdownCategoryRepository,
    private readonly dropdownOptionRepository: DropdownOptionRepository,
  ) {}

  async create(createDto: CreateDropdownSelectionDto): Promise<DropdownSelection> {
    // تحقق من وجود الفئة إذا تم تحديدها
    if (createDto.dropdownCategoryId) {
      const categoryExists = await this.dropdownCategoryRepository.findOne({
        where: { id: createDto.dropdownCategoryId },
      });
      if (!categoryExists) {
        throw new BadRequestException(
          `Dropdown category with ID ${createDto.dropdownCategoryId} not found`,
        );
      }
    }

    // تحقق من وجود القائمة المنسدلة إذا تم تحديدها
    let dropdown: Dropdown = null;
    if (createDto.dropdownId) {
      dropdown = await this.dropdownRepository.findOne({
        where: { id: createDto.dropdownId },
      });
      if (!dropdown) {
        throw new BadRequestException(`Dropdown with ID ${createDto.dropdownId} not found`);
      }
    }

    // تحقق من وجود الخيار إذا تم تحديده
    if (createDto.selectedOptionId) {
      const optionExists = await this.dropdownOptionRepository.findOne({
        where: { id: createDto.selectedOptionId },
      });
      if (!optionExists) {
        throw new BadRequestException(
          `Dropdown option with ID ${createDto.selectedOptionId} not found`,
        );
      }

      // تحقق من أن الخيار ينتمي إلى القائمة المنسدلة المحددة
      if (dropdown && optionExists.dropdownId !== dropdown.id) {
        throw new BadRequestException(
          `Option with ID ${createDto.selectedOptionId} does not belong to dropdown with ID ${createDto.dropdownId}`,
        );
      }
    }

    // تحقق من نوع الاختيار (فردي أو متعدد)
    if (dropdown && dropdown.selectionType === 'single') {
      // للاختيار الفردي، تحقق من عدم وجود اختيار سابق لنفس السجل والقائمة المنسدلة
      const existingSelection = await this.dropdownSelectionRepository.findOne({
        where: {
          recordId: createDto.recordId,
          recordType: createDto.recordType,
          dropdownId: createDto.dropdownId,
        },
      });

      if (existingSelection && !dropdown.allowDuplicates) {
        throw new BadRequestException(
          `Single selection dropdown already has a selection for this record. Update the existing selection instead.`,
        );
      }
    }

    const selection = this.dropdownSelectionRepository.create(createDto);
    return this.dropdownSelectionRepository.save(selection);
  }

  async findByRecord(recordId: number, recordType: string): Promise<DropdownSelection[]> {
    return this.dropdownSelectionRepository.findByRecord(recordId, recordType);
  }

  async findOne(id: number): Promise<DropdownSelection> {
    const selection = await this.dropdownSelectionRepository.findOne({
      where: { id },
      relations: ['dropdown', 'dropdownCategory', 'selectedOption'],
    });
    if (!selection) {
      throw new NotFoundException(`Dropdown selection with ID ${id} not found`);
    }
    return selection;
  }

  async remove(id: number): Promise<void> {
    const selection = await this.findOne(id);
    await this.dropdownSelectionRepository.remove(selection);
  }

  async removeByRecord(recordId: number, recordType: string): Promise<void> {
    await this.dropdownSelectionRepository.deleteByRecord(recordId, recordType);
  }

  async bulkCreate(
    recordId: number,
    recordType: string,
    selections: CreateDropdownSelectionDto[],
  ): Promise<DropdownSelection[]> {
    // حذف الاختيارات الحالية للسجل
    await this.removeByRecord(recordId, recordType);

    // إنشاء اختيارات جديدة
    const createdSelections: DropdownSelection[] = [];
    for (const selection of selections) {
      selection.recordId = recordId;
      selection.recordType = recordType;
      const created = await this.create(selection);
      createdSelections.push(created);
    }

    return createdSelections;
  }
}