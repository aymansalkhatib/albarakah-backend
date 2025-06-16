import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DropdownOptionRepository } from '../repositories/dropdown-option.repository';
import { CreateDropdownOptionDto } from '../dto/create-dropdown-option.dto';
import { UpdateDropdownOptionDto } from '../dto/update-dropdown-option.dto';
import { DropdownOption } from '../entities/dropdown-option.entity';
import { PaginationOptions, PaginationResult } from '../../../shared/pagination/dto/interfaces/pagination.interface';
import { DropdownRepository } from '../repositories/dropdown.repository';
import { DropdownSelectionRepository } from '../repositories/dropdown-selection.repository';

@Injectable()
export class DropdownOptionService {
  constructor(
    private readonly dropdownOptionRepository: DropdownOptionRepository,
    private readonly dropdownRepository: DropdownRepository,
    private readonly dropdownSelectionRepository: DropdownSelectionRepository,
  ) {}

  async create(createDto: CreateDropdownOptionDto): Promise<DropdownOption> {
    // تحقق من وجود القائمة المنسدلة
    const dropdown = await this.dropdownRepository.findOne({
      where: { id: createDto.dropdownId },
    });
    if (!dropdown) {
      throw new BadRequestException(`Dropdown with ID ${createDto.dropdownId} not found`);
    }

    const option = this.dropdownOptionRepository.create(createDto);
    return this.dropdownOptionRepository.save(option);
  }

  async findAll(
    dropdownId: number,
    paginationOptions: PaginationOptions,
  ): Promise<PaginationResult<DropdownOption>> {
    // تحقق من وجود القائمة المنسدلة
    const dropdown = await this.dropdownRepository.findOne({
      where: { id: dropdownId },
    });
    if (!dropdown) {
      throw new NotFoundException(`Dropdown with ID ${dropdownId} not found`);
    }

    return this.dropdownOptionRepository.findAllPaginated(dropdownId, paginationOptions);
  }

  async findOne(id: number): Promise<DropdownOption> {
    const option = await this.dropdownOptionRepository.findOne({
      where: { id },
      relations: ['dropdown'],
    });
    if (!option) {
      throw new NotFoundException(`Dropdown option with ID ${id} not found`);
    }
    return option;
  }

  async update(id: number, updateDto: UpdateDropdownOptionDto): Promise<DropdownOption> {
    const option = await this.findOne(id);

    // تحديث الكائن
    Object.assign(option, updateDto);
    return this.dropdownOptionRepository.save(option);
  }

  async remove(id: number): Promise<void> {
    const option = await this.findOne(id);

    // تحقق من عدم استخدام الخيار في أي اختيارات
    const selections = await this.dropdownSelectionRepository.count({
      where: { selectedOptionId: id },
    });

    if (selections > 0) {
      throw new BadRequestException(
        'Cannot delete option that is being used in selections. Remove selections first.',
      );
    }

    await this.dropdownOptionRepository.remove(option);
  }

  async findByDropdown(dropdownId: number): Promise<DropdownOption[]> {
    // تحقق من وجود القائمة المنسدلة
    const dropdown = await this.dropdownRepository.findOne({
      where: { id: dropdownId },
    });
    if (!dropdown) {
      throw new NotFoundException(`Dropdown with ID ${dropdownId} not found`);
    }

    return this.dropdownOptionRepository.findByDropdown(dropdownId);
  }
}