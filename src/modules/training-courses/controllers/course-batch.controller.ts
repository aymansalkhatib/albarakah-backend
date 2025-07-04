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
import { CourseBatchService } from '../services/course-batch.service';
import { CreateCourseBatchDto } from '../dtos/requests/create-course-batch.dto';
import { UpdateCourseBatchDto } from '../dtos/requests/update-course-batch.dto';
import { FilterCourseBatchDto } from '../dtos/queries/filter-course-batch.dto';
import { CourseBatchResponseDto } from '../dtos/responses/course-batch-response.dto';
import { SerializeResponse } from '@app/common/decorators/serialize-response.decorator';
import { PaginationResponseDto } from '@app/common/pagination/dto/pagination-response.dto';

@Controller('course-batches')
@SerializeResponse(CourseBatchResponseDto)
export class CourseBatchController {
  constructor(private readonly courseBatchService: CourseBatchService) {}

  @Post()
  async create(@Body() createCourseBatchDto: CreateCourseBatchDto) {
    return this.courseBatchService.create(createCourseBatchDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseBatchDto: UpdateCourseBatchDto,
  ) {
    return this.courseBatchService.update(id, updateCourseBatchDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.courseBatchService.delete(id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseBatchService.findOne(id, ['trainingCourse']);
  }

  @Get()
  @SerializeResponse(PaginationResponseDto<CourseBatchResponseDto>)
  async findAll(@Query() filterDto: FilterCourseBatchDto) {
    return this.courseBatchService.findAll(filterDto);
  }
}
