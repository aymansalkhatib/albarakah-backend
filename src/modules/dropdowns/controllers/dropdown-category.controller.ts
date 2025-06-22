import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DropdownCategoryService } from '../services/dropdown-category.service';
import { CreateDropdownCategoryDto } from '../dtos/dropdown-category/create-dropdown-category.dto';
import { UpdateDropdownCategoryDto } from '../dtos/dropdown-category/update-dropdown-category.dto';
import { DropdownCategory } from '../entities/dropdown-category.entity';
import { ResponseDropdownCategoryDto } from '../dtos/dropdown-category/response-dropdown-category.dto';
import { SerializeResponse } from 'src/common/decorators/serialize-response.decorator';
import { FilterDropdownCategoryDto } from '../dtos/dropdown-category/filter-dropdown-category.dto';
import { PaginationResponseDto } from 'src/common/pagination/dto/pagination-response.dto';

@Controller('dropdown-categories')
export class DropdownCategoryController {
  constructor(private readonly dropdownCategoryService: DropdownCategoryService) {}

  @Post()
  @SerializeResponse(ResponseDropdownCategoryDto)
  async create(@Body() createDto: CreateDropdownCategoryDto): Promise<DropdownCategory> {
    return this.dropdownCategoryService.create(createDto);
  }

  @Patch(':id')
  @SerializeResponse(ResponseDropdownCategoryDto)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateDropdownCategoryDto,
  ): Promise<DropdownCategory> {
    return this.dropdownCategoryService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.dropdownCategoryService.delete(id);
  }

  @Get(':id')
  @SerializeResponse(ResponseDropdownCategoryDto)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<DropdownCategory> {
    return this.dropdownCategoryService.findOne(id);
  }

  @Get()
  async findAll(
    @Query() filter: FilterDropdownCategoryDto,
  ): Promise<PaginationResponseDto<ResponseDropdownCategoryDto>> {
    return this.dropdownCategoryService.findAll(filter);
  }
}
