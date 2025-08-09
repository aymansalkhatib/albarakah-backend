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
import { TrainingCoursesService } from '../services/training-courses.service';
import { CreateTrainingCourseDto } from '../dtos/requests/create-training-course.dto';
import { UpdateTrainingCourseDto } from '../dtos/requests/update-training-course.dto';
import { FilterTrainingCourseDto } from '../dtos/queries/filter-training-course.dto';
import { TrainingCourseResponseDto } from '../dtos/responses/training-course-response.dto';
import { SerializeResponse } from '../../../common/decorators/serialize-response.decorator';
import { Protected } from '../../../common/decorators/protected.decorator';
import { Permission } from '../../roles/enums/permission.enum';

@Controller('training-courses')
export class TrainingCoursesController {
  constructor(private readonly trainingCoursesService: TrainingCoursesService) {}

  @Post()
  @SerializeResponse(TrainingCourseResponseDto)
  @Protected(Permission.CREATE_TRAINING_COURSE)
  async create(@Body() createTrainingCourseDto: CreateTrainingCourseDto) {
    return this.trainingCoursesService.create(createTrainingCourseDto);
  }

  @Patch(':id')
  @SerializeResponse(TrainingCourseResponseDto)
  @Protected(Permission.UPDATE_TRAINING_COURSE)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTrainingCourseDto: UpdateTrainingCourseDto,
  ) {
    return this.trainingCoursesService.update(id, updateTrainingCourseDto);
  }

  @Delete(':id')
  @Protected(Permission.DELETE_TRAINING_COURSE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.trainingCoursesService.delete(id);
  }

  @Get(':id')
  @SerializeResponse(TrainingCourseResponseDto)
  @Protected(Permission.READ_TRAINING_COURSE)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.trainingCoursesService.findOne(id);
  }

  @Get()
  @Protected(Permission.READ_TRAINING_COURSE)
  async findAll(@Query() filterDto: FilterTrainingCourseDto) {
    return this.trainingCoursesService.findAll(filterDto);
  }
}
