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
import { VisitsService } from '../services/visits.service';
import { CreateVisitDto } from '../dtos/requests/create-visit.dto';
import { UpdateVisitDto } from '../dtos/requests/update-visit.dto';
import { FilterVisitDto } from '../dtos/queries/filter-visit.dto';
import { VisitResponseDto } from '../dtos/responses/visit-response.dto';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { Protected } from '../../../common/decorators/protected.decorator';
import { Permission } from '../../roles/enums/permission.enum';
import { SerializeResponse } from '../../../common/decorators/serialize-response.decorator';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  @Protected(Permission.CREATE_VISIT)
  @SerializeResponse(VisitResponseDto)
  async create(@Body() createVisitDto: CreateVisitDto): Promise<VisitResponseDto> {
    return await this.visitsService.create(createVisitDto);
  }

  @Get()
  @Protected(Permission.READ_VISIT)
  async findAll(@Query() filter: FilterVisitDto): Promise<PaginationResponseDto<VisitResponseDto>> {
    return await this.visitsService.findAll(filter);
  }

  @Get(':id')
  @Protected(Permission.READ_VISIT)
  @SerializeResponse(VisitResponseDto)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<VisitResponseDto> {
    return await this.visitsService.findOne(id);
  }

  @Patch(':id')
  @Protected(Permission.UPDATE_VISIT)
  @SerializeResponse(VisitResponseDto)
  async update(
    @Param('id') id: number,
    @Body() updateVisitDto: UpdateVisitDto,
  ): Promise<VisitResponseDto> {
    return await this.visitsService.update(id, updateVisitDto);
  }

  @Delete(':id')
  @Protected(Permission.DELETE_VISIT)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.visitsService.delete(id);
  }
}
