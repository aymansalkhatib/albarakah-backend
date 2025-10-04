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
import { Protected } from '../../../common/decorators/protected.decorator';
import { SerializeResponse } from '../../../common/decorators/serialize-response.decorator';
import { MonthlyStatsQueryDto } from '../../../common/dtos/monthly-stats-query.dto';
import { MonthlyStatsResponseDto } from '../../../common/dtos/monthly-stats-response.dto';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { Permission } from '../../../modules/roles/enums/permission.enum';
import { FilterSupporterDto } from '../dtos/queries/filter-supporter.dto';
import { CreateSupporterDto } from '../dtos/requests/create-supporter.dto';
import { UpdateSupporterDto } from '../dtos/requests/update-supporter.dto';
import { SupporterResponseDto } from '../dtos/responses/supporter-response.dto';
import { SupportersService } from '../services/supporters.service';

@Controller('supporters')
export class SupportersController {
  constructor(private readonly supportersService: SupportersService) {}

  @Post()
  @Protected(Permission.CREATE_SUPPORTER)
  @SerializeResponse(SupporterResponseDto)
  create(
    @Body() createSupporterDto: CreateSupporterDto,
  ): Promise<SupporterResponseDto> {
    return this.supportersService.create(createSupporterDto);
  }

  @Get()
  @Protected(Permission.READ_SUPPORTER)
  findAll(
    @Query() filterDto: FilterSupporterDto,
  ): Promise<PaginationResponseDto<SupporterResponseDto>> {
    return this.supportersService.findAll(filterDto);
  }

  @Get('monthly-stats')
  @Protected(Permission.READ_SUPPORTER)
  @SerializeResponse(MonthlyStatsResponseDto)
  async getMonthlyStats(
    @Query() query: MonthlyStatsQueryDto,
  ): Promise<MonthlyStatsResponseDto[]> {
    return await this.supportersService.getMonthlyStats(query);
  }
  

  @Get(':id')
  @Protected(Permission.READ_SUPPORTER)
  @SerializeResponse(SupporterResponseDto)
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SupporterResponseDto> {
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
