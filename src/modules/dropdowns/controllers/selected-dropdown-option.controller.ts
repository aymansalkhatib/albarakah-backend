import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { Protected } from '../../../common/decorators/protected.decorator';
import { SerializeResponse } from '../../../common/decorators/serialize-response.decorator';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { Permission } from '../../roles/enums/permission.enum';
import { CreateSelectedDropdownOptionDto } from '../dtos/selected-dropdown-option/create-selected-dropdown-option.dto';
import { FilterSelectedDropdownOptionDto } from '../dtos/selected-dropdown-option/filter-selected-dropdown-option.dto';
import { ResponseSelectedDropdownOptionDto } from '../dtos/selected-dropdown-option/response-selected-dropdown-option.dto';
import { SelectedDropdownOptionService } from '../services/selected-dropdown-option.service';

@Controller('selected-dropdown-options')
export class SelectedDropdownOptionController {
  constructor(private readonly selectedDropdownOptionService: SelectedDropdownOptionService) {}

  @Get()
  @Protected(Permission.READ_SELECTED_DROPDOWN_OPTION)
  findAll(
    @Query() filterDto: FilterSelectedDropdownOptionDto,
  ): Promise<PaginationResponseDto<ResponseSelectedDropdownOptionDto>> {
    return this.selectedDropdownOptionService.findAll(filterDto);
  }

  @Post()
  @Protected(Permission.CREATE_SELECTED_DROPDOWN_OPTION)
  @SerializeResponse(ResponseSelectedDropdownOptionDto)
  create(
    @Body() createDto: CreateSelectedDropdownOptionDto,
  ): Promise<ResponseSelectedDropdownOptionDto> {
    return this.selectedDropdownOptionService.upsert(createDto);
  }

  @Get(':id')
  @Protected(Permission.READ_SELECTED_DROPDOWN_OPTION)
  @SerializeResponse(ResponseSelectedDropdownOptionDto)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseSelectedDropdownOptionDto> {
    return this.selectedDropdownOptionService.findOne(id, {
      relations: ['dropdown', 'selectedOption', 'category'],
    });
  }

  @Delete(':id')
  @Protected(Permission.DELETE_SELECTED_DROPDOWN_OPTION)
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.selectedDropdownOptionService.delete(id);
  }
}
