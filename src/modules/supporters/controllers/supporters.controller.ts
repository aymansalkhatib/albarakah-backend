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
import { SupportersService } from '../services/supporters.service';
import { CreateSupporterDto } from '../dtos/create-supporter.dto';
import { UpdateSupporterDto } from '../dtos/update-supporter.dto';
import { SupporterResponseDto } from '../dtos/supporter-response.dto';
import { FilterSupporterDto } from '../dtos/filter-supporter.dto';
import { SerializeResponse } from '@app/common/decorators/serialize-response.decorator';
import { Protected } from '@app/common/decorators/protected.decorator';
import { Permission } from '@app/modules/roles/enums/permission.enum';
import { PaginationResponseDto } from '@app/common/pagination/dto/pagination-response.dto';

@Controller('supporters')
export class SupportersController {
  constructor(private readonly supportersService: SupportersService) {}

  @Post()
  @Protected(Permission.CREATE_SUPPORTER)
  @SerializeResponse(SupporterResponseDto)
  create(@Body() createSupporterDto: CreateSupporterDto): Promise<SupporterResponseDto> {
    return this.supportersService.create(createSupporterDto);
  }

  @Get()
  @Protected(Permission.READ_SUPPORTER)
  findAll(
    @Query() filterDto: FilterSupporterDto,
  ): Promise<PaginationResponseDto<SupporterResponseDto>> {
    return this.supportersService.findAll(filterDto);
  }

  @Get(':id')
  @Protected(Permission.READ_SUPPORTER)
  @SerializeResponse(SupporterResponseDto)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SupporterResponseDto> {
    return this.supportersService.findOne(id, { relations: ['person'] });
  }

  @Patch(':id')
  @Protected(Permission.UPDATE_SUPPORTER)
  @SerializeResponse(SupporterResponseDto)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSupporterDto: UpdateSupporterDto,
  ): Promise<SupporterResponseDto> {
    return this.supportersService.update(id, updateSupporterDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Protected(Permission.DELETE_SUPPORTER)
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.supportersService.delete(id);
  }
}
