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
import { DropdownService } from '../services/dropdown.service';
import { UpdateDropdownDto } from '../dtos/dropdown/update-dropdown.dto';
import { Dropdown } from '../entities/dropdown.entity';
import { PaginationResponseDto } from 'src/common/pagination/dto/pagination-response.dto';
import { CreateDropdownDto } from '../dtos/dropdown/create-dropdown.dto';
import { FilterDropdownDto } from '../dtos/dropdown/filter-dropdown.dto';
import { SerializeResponse } from 'src/common/decorators/serialize-response.decorator';
import { ResponseDropdownDto } from '../dtos/dropdown/response-dropdown.dto';

@Controller('dropdowns')
export class DropdownController {
  constructor(private readonly dropdownService: DropdownService) {}

  @Post()
  @SerializeResponse(ResponseDropdownDto)
  create(@Body() createDto: CreateDropdownDto): Promise<Dropdown> {
    return this.dropdownService.create(createDto);
  }

  @Patch(':id')
  @SerializeResponse(ResponseDropdownDto)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateDropdownDto,
  ): Promise<Dropdown> {
    return this.dropdownService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.dropdownService.remove(id);
  }

  @Get()
  findAll(@Query() filter: FilterDropdownDto): Promise<PaginationResponseDto<ResponseDropdownDto>> {
    return this.dropdownService.findAll(filter);
  }

  @Get(':id')
  @SerializeResponse(ResponseDropdownDto)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseDropdownDto> {
    return this.dropdownService.findOne(id);
  }

  @Get('category/:categoryId')
  @SerializeResponse(ResponseDropdownDto)
  findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number): Promise<Dropdown[]> {
    return this.dropdownService.findByCategory(categoryId);
  }
}
