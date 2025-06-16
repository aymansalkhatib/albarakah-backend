import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DropdownRepository } from '../repositories/dropdown.repository';
import { CreateDropdownDto } from '../dto/create-dropdown.dto';
import { UpdateDropdownDto } from '../dto/update-dropdown.dto';
import { Dropdown } from '../entities/dropdown.entity';
import { FilterDropdownDto } from '../dto/filter-dropdown.dto';
import { PaginationOptions, PaginationResult } from '../../../shared/pagination/dto/interfaces/pagination.interface';
import { DropdownCategoryRepository } from '../repositories/dropdown-category.repository';

@Injectable()
export class DropdownService {
  constructor(
    private readonly dropdownRepository: DropdownRepository,
    private readonly dropdownCategoryRepository: DropdownCategoryRepository,
  ) {}

  async create(createDto: CreateDropdownDto): Promise<Dropdown> {
    // تحقق من وجود الفئة
    const categoryExists = await this.dropdownCategoryRepository.findOne({
      where: { id: createDto.dropdownCategoryId },
    });
    if (!categoryExists) {
      throw new BadRequestException(
        `Dropdown category with ID ${createDto.dropdownCategoryId} not found`,
      );
    }

    // تحقق من فريد اسم القائمة المنسدلة
    const existingDropdown = await this.dropdownRepository.findOne({
      where: { dropdownName: createDto.dropdownName },
    });
    if (existingDropdown) {
      throw new BadRequestException(`Dropdown with name "${createDto.dropdownName}" already exists`);
    }

    const dropdown = this.dropdownRepository.create(createDto);
    return this.dropdownRepository.save(dropdown);
  }

  async findAll(
    filter: FilterDropdownDto,
    paginationOptions: PaginationOptions,
  ): Promise<PaginationResult<Dropdown>> {
    return this.dropdownRepository.findAllPaginated(filter, paginationOptions);
  }

  async findOne(id: number): Promise<Dropdown> {
    const dropdown = await this.dropdownRepository.findWithRelations(id);
    if (!dropdown) {
      throw new NotFoundException(`Dropdown with ID ${id} not found`);
    }
    return dropdown;
  }

  async update(id: number, updateDto: UpdateDropdownDto): Promise<Dropdown> {
    const dropdown = await this.findOne(id);

    // تحقق من وجود الفئة إذا تم تحديدها
    if (updateDto.dropdownCategoryId) {
      const categoryExists = await this.dropdownCategoryRepository.findOne({
        where: { id: updateDto.dropdownCategoryId },
      });
      if (!categoryExists) {
        throw new BadRequestException(
          `Dropdown category with ID ${updateDto.dropdownCategoryId} not found`,
        );
      }
    }

    // تحقق من فريد اسم القائمة المنسدلة إذا تم تحديثه
    if (updateDto.dropdownName && updateDto.dropdownName !== dropdown.dropdownName) {
      const existingDropdown = await this.dropdownRepository.findOne({
        where: { dropdownName: updateDto.dropdownName },
      });
      if (existingDropdown) {
        throw new BadRequestException(
          `Dropdown with name "${updateDto.dropdownName}" already exists`,
        );
      }
    }

    // تحديث الكائن
    Object.assign(dropdown, updateDto);
    return this.dropdownRepository.save(dropdown);
  }

  async remove(id: number): Promise<void> {
    const dropdown = await this.findOne(id);

    // تحقق من عدم وجود خيارات مرتبطة
    if (dropdown.options && dropdown.options.length > 0) {
      throw new BadRequestException(
        'Cannot delete dropdown with options. Remove options first or use force delete.',
      );
    }

    await this.dropdownRepository.remove(dropdown);
  }

  async findByCategory(categoryId: number): Promise<Dropdown[]> {
    // تحقق من وجود الفئة
    const categoryExists = await this.dropdownCategoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!categoryExists) {
      throw new NotFoundException(`Dropdown category with ID ${categoryId} not found`);
    }

    return this.dropdownRepository.findByCategory(categoryId);
  }
}