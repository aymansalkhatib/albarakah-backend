import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateDropdownDto } from '../dto/dropdown/update-dropdown.dto';
import { Dropdown } from '../entities/dropdown.entity';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { PaginationResponseDto } from 'src/common/pagination/dto/pagination-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DropdownCategory } from '../entities/dropdown-category.entity';
import { paginate } from 'src/common/pagination/paginate.service';
import { DropdownCategoryService } from './dropdown-category.service';
import { FilterDropdownDto } from '../dto/dropdown/filter-dropdown.dto';
import { CreateDropdownDto } from '../dto/dropdown/create-dropdown.dto';
import { ResponseDropdownDto } from '../dto/dropdown/response-dropdown.dto';

@Injectable()
export class DropdownService {
  constructor(
    private readonly dropdownCategoryService: DropdownCategoryService,
    @InjectRepository(Dropdown)
    private readonly dropdownRepository: Repository<Dropdown>,
  ) {}

  async create(createDto: CreateDropdownDto): Promise<Dropdown> {
    await this.dropdownCategoryService.ensureExists(createDto.dropdownCategoryId);
    await this.checkDuplicateDropdownName(createDto.dropdownName, createDto.dropdownCategoryId);
    const dropdown = this.dropdownRepository.create(createDto);
    return this.dropdownRepository.save(dropdown);
  }

  async update(id: number, updateDto: UpdateDropdownDto): Promise<Dropdown> {
    const dropdown = await this.findOne(id);
    if (updateDto.dropdownName && updateDto.dropdownName !== dropdown.dropdownName) {
      await this.checkDuplicateDropdownName(updateDto.dropdownName, dropdown.dropdownCategoryId);
    }
    const updated = this.dropdownRepository.merge(dropdown, updateDto);
    return this.dropdownRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const dropdown = await this.findOne(id);
    if (dropdown.options && dropdown.options.length > 0) {
      throw new BadRequestException(
        'Cannot delete dropdown with options. Remove options first or use force delete.',
      );
    }
    await this.dropdownRepository.remove(dropdown);
  }

  async findAll(filter: FilterDropdownDto): Promise<PaginationResponseDto<ResponseDropdownDto>> {
    const queryBuilder = this.dropdownRepository.createQueryBuilder('dropdown');

    if (filter.dropdownCategoryId) {
      queryBuilder.andWhere('dropdown.dropdownCategoryId = :dropdownCategoryId', {
        dropdownCategoryId: filter.dropdownCategoryId,
      });
    }
    if (filter.dropdownName) {
      queryBuilder.andWhere('dropdown.dropdownName LIKE :dropdownName', {
        dropdownName: `%${filter.dropdownName}%`,
      });
    }
    if (filter.selectionType) {
      queryBuilder.andWhere('dropdown.selectionType = :selectionType', {
        selectionType: filter.selectionType,
      });
    }

    return paginate(queryBuilder, filter, ResponseDropdownDto);
  }

  async findByCategory(categoryId: number): Promise<Dropdown[]> {
    await this.dropdownCategoryService.ensureExists(categoryId);
    return this.dropdownRepository.find({
      where: { dropdownCategory: { id: categoryId } },
    });
  }

  async findOne(id: number): Promise<Dropdown> {
    const dropdown = await this.dropdownRepository
      .createQueryBuilder('dropdown')
      .leftJoinAndSelect('dropdown.options', 'options')
      .leftJoinAndSelect('dropdown.dropdownCategory', 'dropdownCategory')
      .where('dropdown.id = :id', { id })
      .getOne();
    if (!dropdown) {
      throw new NotFoundException(`Dropdown with ID ${id} not found`);
    }
    console.log(dropdown);

    return dropdown;
  }

  async ensureExists(id: number): Promise<Dropdown> {
    const dropdown = await this.dropdownRepository.findOne({ where: { id } });
    if (!dropdown) {
      throw new NotFoundException(`Dropdown with ID ${id} not found`);
    }
    return dropdown;
  }

  private async checkDuplicateDropdownName(
    dropdownName: string,
    dropdownCategoryId: number,
  ): Promise<void> {
    const existingDropdown = await this.dropdownRepository.findOne({
      where: {
        dropdownName,
        dropdownCategoryId,
      },
    });
    if (existingDropdown) {
      throw new BadRequestException(
        `Dropdown with name "${dropdownName}" already exists in this category`,
      );
    }
  }
}
