import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DropdownCategoryService } from '../services/dropdown-category.service';
import { CreateDropdownCategoryDto } from '../dto/create-dropdown-category.dto';
import { UpdateDropdownCategoryDto } from '../dto/update-dropdown-category.dto';
import { DropdownCategory } from '../entities/dropdown-category.entity';
import { FilterDropdownCategoryDto } from '../dto/filter-dropdown-category.dto';
import { PaginationDto } from '../../../shared/pagination/dto/pagination.dto';
import { PaginationResult } from '../../../shared/pagination/dto/interfaces/pagination.interface';

@Controller('dropdown-categories')
export class DropdownCategoryController {
  constructor(private readonly dropdownCategoryService: DropdownCategoryService) {}

  @Post()
  create(@Body() createDto: CreateDropdownCategoryDto): Promise<DropdownCategory> {
    return this.dropdownCategoryService.create(createDto);
  }

  @Get()
  findAll(
    @Query() filter: FilterDropdownCategoryDto,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginationResult<DropdownCategory>> {
    return this.dropdownCategoryService.findAll(filter, paginationDto);
  }

  @Get('tree')
  getCategoryTree(): Promise<DropdownCategory[]> {
    return this.dropdownCategoryService.getCategoryTree();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<DropdownCategory> {
    return this.dropdownCategoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateDropdownCategoryDto,
  ): Promise<DropdownCategory> {
    return this.dropdownCategoryService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.dropdownCategoryService.remove(id);
  }
}