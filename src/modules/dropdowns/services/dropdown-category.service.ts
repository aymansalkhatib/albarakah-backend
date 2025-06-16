import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DropdownCategoryRepository } from '../repositories/dropdown-category.repository';
import { CreateDropdownCategoryDto } from '../dto/create-dropdown-category.dto';
import { UpdateDropdownCategoryDto } from '../dto/update-dropdown-category.dto';
import { DropdownCategory } from '../entities/dropdown-category.entity';
import { FilterDropdownCategoryDto } from '../dto/filter-dropdown-category.dto';
import { PaginationOptions, PaginationResult } from '../../../shared/pagination/dto/interfaces/pagination.interface';

@Injectable()
export class DropdownCategoryService {
  constructor(private readonly dropdownCategoryRepository: DropdownCategoryRepository) {}

  async create(createDto: CreateDropdownCategoryDto): Promise<DropdownCategory> {
    // إذا تم تحديد الفئة الأب، تحقق من وجودها
    if (createDto.parentId) {
      const parentExists = await this.dropdownCategoryRepository.findOne({
        where: { id: createDto.parentId },
      });
      if (!parentExists) {
        throw new BadRequestException(`Parent category with ID ${createDto.parentId} not found`);
      }
    }

    const category = this.dropdownCategoryRepository.create(createDto);
    return this.dropdownCategoryRepository.save(category);
  }

  async findAll(
    filter: FilterDropdownCategoryDto,
    paginationOptions: PaginationOptions,
  ): Promise<PaginationResult<DropdownCategory>> {
    return this.dropdownCategoryRepository.findAllPaginated(filter, paginationOptions);
  }

  async findOne(id: number): Promise<DropdownCategory> {
    const category = await this.dropdownCategoryRepository.findWithRelations(id);
    if (!category) {
      throw new NotFoundException(`Dropdown category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: number, updateDto: UpdateDropdownCategoryDto): Promise<DropdownCategory> {
    const category = await this.findOne(id);

    // تحقق من عدم تعيين الفئة كأب لنفسها
    if (updateDto.parentId === id) {
      throw new BadRequestException('Category cannot be its own parent');
    }

    // تحقق من وجود الفئة الأب إذا تم تحديدها
    if (updateDto.parentId) {
      const parentExists = await this.dropdownCategoryRepository.findOne({
        where: { id: updateDto.parentId },
      });
      if (!parentExists) {
        throw new BadRequestException(`Parent category with ID ${updateDto.parentId} not found`);
      }
    }

    // تحديث الكائن
    Object.assign(category, updateDto);
    return this.dropdownCategoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);

    // تحقق من عدم وجود فئات فرعية
    const hasChildren = await this.dropdownCategoryRepository.count({
      where: { parentId: id },
    });

    if (hasChildren > 0) {
      throw new BadRequestException(
        'Cannot delete category with children. Remove child categories first.',
      );
    }

    await this.dropdownCategoryRepository.remove(category);
  }

  async getCategoryTree(): Promise<DropdownCategory[]> {
    return this.dropdownCategoryRepository.findCategoryTree();
  }
}