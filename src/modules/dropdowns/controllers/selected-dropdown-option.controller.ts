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

import { PaginationResponseDto } from 'src/common/pagination/dto/pagination-response.dto';
import { SerializeResponse } from 'src/common/decorators/serialize-response.decorator';
import { CreateSelectedDropdownOptionDto } from '../dtos/selected-dropdown-option/create-selected-dropdown-option.dto';
import { FilterSelectedDropdownOptionDto } from '../dtos/selected-dropdown-option/filter-selected-dropdown-option.dto';
import { ResponseSelectedDropdownOptionDto } from '../dtos/selected-dropdown-option/response-selected-dropdown-option.dto';
import { UpdateSelectedDropdownOptionDto } from '../dtos/selected-dropdown-option/update-selected-dropdown-option.dto';
import { SelectedDropdownOptionService } from '../services/selected-dropdown-option.service';

@Controller('selected-dropdown-options')
export class SelectedDropdownOptionController {
  constructor(private readonly selectedDropdownOptionService: SelectedDropdownOptionService) {}

  @Post()
  @SerializeResponse(ResponseSelectedDropdownOptionDto)
  create(
    @Body() createDto: CreateSelectedDropdownOptionDto,
  ): Promise<ResponseSelectedDropdownOptionDto> {
    return this.selectedDropdownOptionService.create(createDto);
  }

  @Post('bulk/:recordType/:recordId')
  @SerializeResponse(ResponseSelectedDropdownOptionDto)
  bulkCreate(
    @Param('recordId', ParseIntPipe) recordId: number,
    @Param('recordType') recordType: string,
    @Body() selections: CreateSelectedDropdownOptionDto[],
  ): Promise<ResponseSelectedDropdownOptionDto[]> {
    return this.selectedDropdownOptionService.bulkCreate(recordId, recordType, selections);
  }

  @Patch(':id')
  @SerializeResponse(ResponseSelectedDropdownOptionDto)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSelectedDropdownOptionDto,
  ): Promise<ResponseSelectedDropdownOptionDto> {
    return this.selectedDropdownOptionService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.selectedDropdownOptionService.delete(id);
  }

  @Delete('by-record/:recordType/:recordId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeByRecord(
    @Param('recordId', ParseIntPipe) recordId: number,
    @Param('recordType') recordType: string,
  ): Promise<void> {
    return this.selectedDropdownOptionService.deleteByRecord(recordId, recordType);
  }

  @Get()
  findAll(
    @Query() filter: FilterSelectedDropdownOptionDto,
  ): Promise<PaginationResponseDto<ResponseSelectedDropdownOptionDto>> {
    return this.selectedDropdownOptionService.findAll(filter);
  }

  @Get('by-record/:recordType/:recordId')
  @SerializeResponse(ResponseSelectedDropdownOptionDto)
  findByRecord(
    @Param('recordId', ParseIntPipe) recordId: number,
    @Param('recordType') recordType: string,
  ): Promise<ResponseSelectedDropdownOptionDto[]> {
    return this.selectedDropdownOptionService.findByRecord(recordId, recordType);
  }

  @Get(':id')
  @SerializeResponse(ResponseSelectedDropdownOptionDto)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseSelectedDropdownOptionDto> {
    return this.selectedDropdownOptionService.findOne(id);
  }
}
