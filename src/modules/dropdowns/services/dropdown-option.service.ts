import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DropdownOption } from '../entities/dropdown-option.entity';
import { DropdownSelection } from '../entities/dropdown-selection.entity';
import { CreateDropdownOptionDto } from '../dto/dropdown-option/create-dropdown-option.dto';
import { UpdateDropdownOptionDto } from '../dto/dropdown-option/update-dropdown-option.dto';
import { FilterDropdownOptionDto } from '../dto/dropdown-option/filter-dropdown-option.dto';
import { ResponseDropdownOptionDto } from '../dto/dropdown-option/response-dropdown-option.dto';
import { PaginationResponseDto } from 'src/common/pagination/dto/pagination-response.dto';
import { paginate } from 'src/common/pagination/paginate.service';
import { DropdownService } from './dropdown.service';
import { Not } from 'typeorm';

@Injectable()
export class DropdownOptionService {
  constructor(
    @InjectRepository(DropdownOption)
    private readonly dropdownOptionRepository: Repository<DropdownOption>,
    private readonly dropdownService: DropdownService,
  ) {}

  async create(createDto: CreateDropdownOptionDto): Promise<DropdownOption> {
    await this.dropdownService.ensureExists(createDto.dropdownId);
    await this.checkDuplicateName(createDto.name, createDto.dropdownId);
    const option = this.dropdownOptionRepository.create(createDto);
    return this.dropdownOptionRepository.save(option);
  }

  async update(id: number, updateDto: UpdateDropdownOptionDto): Promise<DropdownOption> {
    const option = await this.findOne(id);
    if (updateDto.name && updateDto.name !== option.name) {
      await this.checkDuplicateName(updateDto.name, option.dropdownId, id);
    }
    const update = this.dropdownOptionRepository.merge(option, updateDto);
    return this.dropdownOptionRepository.save(update);
  }

  async delete(id: number): Promise<void> {
    const option = await this.findOne(id);
    if (option.selections && option.selections.length > 0) {
      throw new BadRequestException(
        'Cannot delete option that is being used in selections. Remove selections first.',
      );
    }
    await this.dropdownOptionRepository.delete(id);
  }

  findAll(
    filter: FilterDropdownOptionDto,
  ): Promise<PaginationResponseDto<ResponseDropdownOptionDto>> {
    const queryBuilder = this.dropdownOptionRepository.createQueryBuilder('option');
    if (filter.dropdownId) {
      queryBuilder.andWhere('option.dropdownId = :dropdownId', { dropdownId: filter.dropdownId });
    }
    if (filter.name) {
      queryBuilder.andWhere('option.name LIKE :name', { name: `%${filter.name}%` });
    }
    return paginate(queryBuilder, filter, ResponseDropdownOptionDto);
  }

  async findOne(id: number): Promise<DropdownOption> {
    const option = await this.dropdownOptionRepository.findOne({ where: { id } });
    if (!option) {
      throw new NotFoundException(`Dropdown option with ID ${id} not found`);
    }
    return option;
  }

  private async checkDuplicateName(
    name: string,
    dropdownId: number,
    excludeId?: number,
  ): Promise<void> {
    const where: any = { name, dropdownId };
    if (excludeId) {
      where.id = Not(excludeId);
    }
    const existing = await this.dropdownOptionRepository.findOne({ where });
    if (existing) {
      throw new BadRequestException(
        `Dropdown option with name "${name}" already exists in this dropdown.`,
      );
    }
  }
}
