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
import { RecordType } from '../enums/recored-type.enums';

@Controller('selected-dropdown-options')
export class SelectedDropdownOptionController {
  constructor(private readonly selectedDropdownOptionService: SelectedDropdownOptionService) {}

  @Post()
  @SerializeResponse(ResponseSelectedDropdownOptionDto)
  create(
    @Body() createDto: CreateSelectedDropdownOptionDto,
  ): Promise<ResponseSelectedDropdownOptionDto> {
    return this.selectedDropdownOptionService.upsert(createDto);
  }
}
