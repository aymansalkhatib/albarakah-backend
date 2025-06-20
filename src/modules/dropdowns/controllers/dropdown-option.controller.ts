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
import { CreateDropdownOptionDto } from '../dtos/dropdown-option/create-dropdown-option.dto';
import { UpdateDropdownOptionDto } from '../dtos/dropdown-option/update-dropdown-option.dto';
import { FilterDropdownOptionDto } from '../dtos/dropdown-option/filter-dropdown-option.dto';
import { ResponseDropdownOptionDto } from '../dtos/dropdown-option/response-dropdown-option.dto';
import { PaginationResponseDto } from 'src/common/pagination/dto/pagination-response.dto';
import { DropdownOptionService } from '../services/dropdown-option.service';
import { SerializeResponse } from 'src/common/decorators/serialize-response.decorator';

@Controller('dropdown-options')
export class DropdownOptionController {
  constructor(private readonly dropdownOptionService: DropdownOptionService) {}

  @Post()
  @SerializeResponse(ResponseDropdownOptionDto)
  create(@Body() createDto: CreateDropdownOptionDto): Promise<ResponseDropdownOptionDto> {
    return this.dropdownOptionService.create(createDto);
  }

  @Patch(':id')
  @SerializeResponse(ResponseDropdownOptionDto)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateDropdownOptionDto,
  ): Promise<ResponseDropdownOptionDto> {
    return this.dropdownOptionService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.dropdownOptionService.delete(id);
  }

  @Get(':id')
  @SerializeResponse(ResponseDropdownOptionDto)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseDropdownOptionDto> {
    return this.dropdownOptionService.findOne(id);
  }

  @Get()
  findAll(
    @Query() filter: FilterDropdownOptionDto,
  ): Promise<PaginationResponseDto<ResponseDropdownOptionDto>> {
    return this.dropdownOptionService.findAll(filter);
  }
}
