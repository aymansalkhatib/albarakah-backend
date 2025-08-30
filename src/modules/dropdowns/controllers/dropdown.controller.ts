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
import { Protected } from '../../../common/decorators/protected.decorator';
import { SerializeResponse } from '../../../common/decorators/serialize-response.decorator';
import { Permission } from '../../roles/enums/permission.enum';
import { ResponseDropdownDto } from '../dtos/dropdown/response-dropdown.dto';
import { UpsertDropdownDto } from '../dtos/dropdown/upsert-dropdown.dto';
import { Dropdown } from '../entities/dropdown.entity';
import { DropdownService } from '../services/dropdown.service';

@Controller('dropdowns')
export class DropdownController {
  constructor(private readonly dropdownService: DropdownService) {}

  @Post()
  @Protected(Permission.CREATE_DROPDOWN)
  @SerializeResponse(ResponseDropdownDto)
  upsert(@Body() createDto: UpsertDropdownDto): Promise<Dropdown> {
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
    return this.dropdownService.findOne(id, {
      relations: ['options'],
    });
  }
}
