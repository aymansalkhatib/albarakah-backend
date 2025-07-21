import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { PaginationResponseDto } from '@app/common/pagination/dto/pagination-response.dto';
import { SerializeResponse } from '@app/common/decorators/serialize-response.decorator';
import { FilterCallLogDto } from '../dtos/queries/filter-call-log.dto';
import { CreateCallLogDto } from '../dtos/requests/create-call-log.dto';
import { UpdateCallLogDto } from '../dtos/requests/update-call-log.dto';
import { CallLogResponseDto } from '../dtos/responses/call-log-response.dto';
import { CallLog } from '../entities/call-log.entity';
import { CallLogsService } from '../services/call-logs.service';

@Controller('call-logs')
export class CallLogsController {
  constructor(private readonly callLogsService: CallLogsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @SerializeResponse(CallLogResponseDto)
  async create(@Body() createCallLogDto: CreateCallLogDto): Promise<CallLog> {
    return this.callLogsService.create(createCallLogDto);
  }

  @Get()
  async findAll(
    @Query() filterDto: FilterCallLogDto,
  ): Promise<PaginationResponseDto<CallLogResponseDto>> {
    return this.callLogsService.findAll(filterDto);
  }

  @Get(':id')
  @SerializeResponse(CallLogResponseDto)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CallLog> {
    return this.callLogsService.findOne(id);
  }

  @Patch(':id')
  @SerializeResponse(CallLogResponseDto)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCallLogDto: UpdateCallLogDto,
  ): Promise<CallLog> {
    return this.callLogsService.update(id, updateCallLogDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.callLogsService.delete(id);
  }
}
