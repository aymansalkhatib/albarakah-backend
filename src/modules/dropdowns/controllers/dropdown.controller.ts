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
import { Dropdown } from '../entities/dropdown.entity';
import { UpsertDropdownDto } from '../dtos/dropdown/upsert-dropdown.dto';
import { SerializeResponse } from 'src/common/decorators/serialize-response.decorator';
import { ResponseDropdownDto } from '../dtos/dropdown/response-dropdown.dto';

@Controller('dropdowns')
export class DropdownController {
  constructor(private readonly dropdownService: DropdownService) {}

  @Post()
  @SerializeResponse(ResponseDropdownDto)
  create(@Body() createDto: UpsertDropdownDto): Promise<Dropdown> {
    return this.dropdownService.upsert(createDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.dropdownService.remove(id);
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
