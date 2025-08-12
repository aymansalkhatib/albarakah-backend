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
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { Permission } from '../../../modules/roles/enums/permission.enum';

import { InterviewsService } from '../services/interviews.service';
import { CreateInterviewDto } from '../dtos/requests/create-interview.dto';
import { UpdateInterviewDto } from '../dtos/requests/update-interview.dto';
import { FilterInterviewDto } from '../dtos/queries/filter-interview.dto';
import { InterviewResponseDto } from '../dtos/responses/interview-response.dto';

@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post()
  @Protected(Permission.CREATE_INTERVIEW)
  @SerializeResponse(InterviewResponseDto)
  async create(@Body() dto: CreateInterviewDto): Promise<InterviewResponseDto> {
    return this.interviewsService.create(dto);
  }

  @Get()
  @Protected(Permission.READ_INTERVIEW)
  async findAll(
    @Query() filter: FilterInterviewDto,
  ): Promise<PaginationResponseDto<InterviewResponseDto>> {
    return this.interviewsService.findAll(filter);
  }

  @Get(':id')
  @Protected(Permission.READ_INTERVIEW)
  @SerializeResponse(InterviewResponseDto)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<InterviewResponseDto> {
    return this.interviewsService.findOne(id);
  }

  @Patch(':id')
  @Protected(Permission.UPDATE_INTERVIEW)
  @SerializeResponse(InterviewResponseDto)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInterviewDto,
  ): Promise<InterviewResponseDto> {
    return this.interviewsService.update(id, dto);
  }

  @Delete(':id')
  @Protected(Permission.DELETE_INTERVIEW)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.interviewsService.delete(id);
  }
}
