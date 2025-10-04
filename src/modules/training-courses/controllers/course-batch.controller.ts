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
import { CourseMonthlyStatsQueryDto } from '../../../common/dtos/course-monthly-stats-query.dto';
import { MonthlyStatsResponseDto } from '../../../common/dtos/monthly-stats-response.dto';
import { Permission } from '../../roles/enums/permission.enum';
import { FilterCourseBatchDto } from '../dtos/queries/filter-course-batch.dto';
import { CreateCourseBatchDto } from '../dtos/requests/create-course-batch.dto';
import { UpdateCourseBatchDto } from '../dtos/requests/update-course-batch.dto';
import { CourseBatchResponseDto } from '../dtos/responses/course-batch-response.dto';
import { CourseBatchService } from '../services/course-batch.service';

@Controller('course-batches')
export class CourseBatchController {
  constructor(private readonly courseBatchService: CourseBatchService) {}

  @Post()
  @SerializeResponse(CourseBatchResponseDto)
  @Protected(Permission.CREATE_TRAINING_COURSE)
  async create(@Body() createCourseBatchDto: CreateCourseBatchDto) {
    return this.courseBatchService.create(createCourseBatchDto);
  }

  @Patch(':id')
  @SerializeResponse(CourseBatchResponseDto)
  @Protected(Permission.UPDATE_TRAINING_COURSE)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseBatchDto: UpdateCourseBatchDto,
  ) {
    return this.courseBatchService.update(id, updateCourseBatchDto);
  }

  @Delete(':id')
  @Protected(Permission.DELETE_TRAINING_COURSE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.courseBatchService.delete(id);
  }

  @Get('monthly-stats')
  @Protected(Permission.READ_TRAINING_COURSE)
  @SerializeResponse(MonthlyStatsResponseDto)
  async getCourseBatchMonthlyStats(
    @Query() query: CourseMonthlyStatsQueryDto,
  ): Promise<MonthlyStatsResponseDto[]> {
    return await this.courseBatchService.getCourseBatchMonthlyStats(query);
  }

  @Get(':id')
  @SerializeResponse(CourseBatchResponseDto)
  @Protected(Permission.READ_TRAINING_COURSE)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseBatchService.findOne(id);
  }

  @Get()
  @Protected(Permission.READ_TRAINING_COURSE)
  async findAll(@Query() filterDto: FilterCourseBatchDto) {
    return this.courseBatchService.findAll(filterDto);
  }
}
