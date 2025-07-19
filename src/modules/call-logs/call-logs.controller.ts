import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CallLogsService } from './call-logs.service';
import { CreateCallLogDto } from './dto/create-call-log.dto';
import { UpdateCallLogDto } from './dto/update-call-log.dto';
import { FilterCallLogDto } from './dto/filter-call-log.dto';
import { CallLogResponseDto } from './dto/call-log-response.dto';
import { plainToClass } from 'class-transformer';
import { PaginationResponseDto } from '@app/common/pagination/dto/pagination-response.dto';

@Controller('call-logs')
export class CallLogsController {
  constructor(private readonly callLogsService: CallLogsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCallLogDto: CreateCallLogDto): Promise<CallLogResponseDto> {
    const callLog = await this.callLogsService.create(createCallLogDto);
    return plainToClass(CallLogResponseDto, callLog, { excludeExtraneousValues: true });
  }

  @Get()
  async findAll(@Query() filterDto: FilterCallLogDto): Promise<PaginationResponseDto<CallLogResponseDto>> {
    return this.callLogsService.findAll(filterDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CallLogResponseDto> {
    const callLog = await this.callLogsService.findOne(id);
    return plainToClass(CallLogResponseDto, callLog, { excludeExtraneousValues: true });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCallLogDto: UpdateCallLogDto,
  ): Promise<CallLogResponseDto> {
    const callLog = await this.callLogsService.update(id, updateCallLogDto);
    return plainToClass(CallLogResponseDto, callLog, { excludeExtraneousValues: true });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.callLogsService.remove(id);
  }
}