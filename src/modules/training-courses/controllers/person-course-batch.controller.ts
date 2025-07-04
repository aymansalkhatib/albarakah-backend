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
import { PersonCourseBatchService } from '../services/person-course-batch.service';
import { CreatePersonCourseBatchDto } from '../dtos/requests/create-person-course-batch.dto';
import { UpdatePersonCourseBatchDto } from '../dtos/requests/update-person-course-batch.dto';
import { FilterPersonCourseBatchDto } from '../dtos/queries/filter-person-course-batch.dto';
import { PersonCourseBatchResponseDto } from '../dtos/responses/person-course-batch-response.dto';
import { SerializeResponse } from '@app/common/decorators/serialize-response.decorator';
import { PaginationResponseDto } from '@app/common/pagination/dto/pagination-response.dto';
import { Protected } from '@app/common/decorators/protected.decorator';
import { Permission } from '../../roles/enums/permission.enum';

@Controller('person-course-batches')
@SerializeResponse(PersonCourseBatchResponseDto)
export class PersonCourseBatchController {
  constructor(private readonly personCourseBatchService: PersonCourseBatchService) {}

  @Post()
  @Protected(Permission.CREATE_TRAINING_COURSE)
  async create(@Body() createPersonCourseBatchDto: CreatePersonCourseBatchDto) {
    return this.personCourseBatchService.create(createPersonCourseBatchDto);
  }

  @Patch(':id')
  @Protected(Permission.UPDATE_TRAINING_COURSE)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePersonCourseBatchDto: UpdatePersonCourseBatchDto,
  ) {
    return this.personCourseBatchService.update(id, updatePersonCourseBatchDto);
  }

  @Delete(':id')
  @Protected(Permission.DELETE_TRAINING_COURSE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.personCourseBatchService.delete(id);
  }

  @Get(':id')
  @Protected(Permission.READ_TRAINING_COURSE)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.personCourseBatchService.findOne(id, [
      'courseBatch',
      'courseBatch.trainingCourse',
      'familyMember',
      'familyMember.person',
    ]);
  }

  @Get()
  @Protected(Permission.READ_TRAINING_COURSE)
  @SerializeResponse(PaginationResponseDto<PersonCourseBatchResponseDto>)
  async findAll(@Query() filterDto: FilterPersonCourseBatchDto) {
    return this.personCourseBatchService.findAll(filterDto);
  }
}
