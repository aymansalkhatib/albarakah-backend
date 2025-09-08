import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { Protected } from '../../../common/decorators/protected.decorator';
import { SerializeResponse } from '../../../common/decorators/serialize-response.decorator';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { Permission } from '../../roles/enums/permission.enum';
import { CreateInterviewDto } from '../dtos/requests/create-interview.dto';
import { GetInterviewsQueryDto } from '../dtos/requests/get-interviews-query.dto';
import { UpdateInterviewDto } from '../dtos/requests/update-interview.dto';
import { InterviewResponseDto } from '../dtos/responses/interview-response.dto';
import { InterviewService } from '../services/interview.service';

@Controller('interview')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post()
  @Protected(Permission.CREATE_INTERVIEW)
  @SerializeResponse(InterviewResponseDto)
  async create(
    @Body() createInterviewDto: CreateInterviewDto,
  ): Promise<InterviewResponseDto> {
    return this.interviewService.create(createInterviewDto);
  }

  @Get()
  @Protected(Permission.READ_INTERVIEW)
  async findAll(
    @Query() query: GetInterviewsQueryDto,
  ): Promise<PaginationResponseDto<InterviewResponseDto>> {
    return this.interviewService.findAll(query);
  }

  @Get(':id')
  @Protected(Permission.READ_INTERVIEW)
  @SerializeResponse(InterviewResponseDto)
  async findOne(@Param('id', ParseIntPipe) id: string): Promise<InterviewResponseDto> {
    return this.interviewService.findOne(+id);
  }

  @Put(':id')
  @Protected(Permission.UPDATE_INTERVIEW)
  @SerializeResponse(InterviewResponseDto)
  async update(
    @Param('id') id: string,
    @Body() updateInterviewDto: UpdateInterviewDto,
  ): Promise<InterviewResponseDto> {
    return this.interviewService.update(+id, updateInterviewDto);
  }
}
