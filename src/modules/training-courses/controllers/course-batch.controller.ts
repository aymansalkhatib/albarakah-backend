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
import { SerializeResponse } from '../../../common/decorators/serialize-response.decorator';
import { Protected } from '../../../common/decorators/protected.decorator';
import { Permission } from '../../roles/enums/permission.enum';

@Controller('course-batches')
export class CourseBatchController {
  constructor(private readonly courseBatchService: CourseBatchService) {}

  @Post()
  @Protected(Permission.CREATE_TRAINING_COURSE)
  @SerializeResponse(CourseBatchResponseDto)
  async create(@Body() createCourseBatchDto: CreateCourseBatchDto) {
    return this.courseBatchService.create(createCourseBatchDto);
  }

  @Patch(':id')
  @Protected(Permission.UPDATE_TRAINING_COURSE)
  @SerializeResponse(CourseBatchResponseDto)
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

  @Get(':id')
  @Protected(Permission.READ_TRAINING_COURSE)
  @SerializeResponse(CourseBatchResponseDto)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseBatchService.findOne(id, ['trainingCourse']);
  }

  @Get()
  @Protected(Permission.READ_TRAINING_COURSE)
  async findAll(@Query() filterDto: FilterCourseBatchDto) {
    return this.courseBatchService.findAll(filterDto);
  }
}
