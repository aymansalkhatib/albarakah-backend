import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { CreateInterviewDto } from '../dtos/requests/create-interview.dto';
import { GetInterviewsQueryDto } from '../dtos/requests/get-interviews-query.dto';
import { UpdateInterviewDto } from '../dtos/requests/update-interview.dto';
import { InterviewResponseDto } from '../dtos/responses/interview-response.dto';
import { InterviewService } from '../services/interview.service';

@Controller('interview')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post()
  async create(
    @Body() createInterviewDto: CreateInterviewDto,
  ): Promise<InterviewResponseDto> {
    return this.interviewService.create(createInterviewDto);
  }

  @Get()
  async findAll(
    @Query() query: GetInterviewsQueryDto,
  ): Promise<PaginationResponseDto<InterviewResponseDto>> {
    return this.interviewService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<InterviewResponseDto> {
    return this.interviewService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInterviewDto: UpdateInterviewDto,
  ): Promise<InterviewResponseDto> {
    return this.interviewService.update(+id, updateInterviewDto);
  }
}
