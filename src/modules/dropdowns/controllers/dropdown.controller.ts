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
} from '@nestjs/common';
import { DropdownService } from '../services/dropdown.service';
import { Dropdown } from '../entities/dropdown.entity';
import { UpsertDropdownDto } from '../dtos/dropdown/upsert-dropdown.dto';
import { SerializeResponse } from '../../../common/decorators/serialize-response.decorator';
import { ResponseDropdownDto } from '../dtos/dropdown/response-dropdown.dto';
import { Protected } from '@app/common/decorators/protected.decorator';
import { Permission } from '@app/modules/roles/enums/permission.enum';

@Controller('dropdowns')
export class DropdownController {
  constructor(private readonly dropdownService: DropdownService) {}

  @Post()
  @Protected(Permission.CREATE_DROPDOWN)
  @SerializeResponse(ResponseDropdownDto)
  create(@Body() createDto: UpsertDropdownDto): Promise<Dropdown> {
    return this.dropdownService.upsert(createDto);
  }

  @Delete(':id')
  @Protected(Permission.DELETE_DROPDOWN)
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.dropdownService.delete(id);
  }

  @Get(':id')
  @Protected(Permission.READ_DROPDOWN)
  @SerializeResponse(ResponseDropdownDto)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseDropdownDto> {
    return this.dropdownService.findOne(id);
  }

  @Get('category/:categoryId')
  @Protected(Permission.READ_DROPDOWN)
  @SerializeResponse(ResponseDropdownDto)
  findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number): Promise<Dropdown[]> {
    return this.dropdownService.findByCategory(categoryId);
  }
}
