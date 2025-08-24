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
import { FilterCallLogDto } from '../dtos/queries/filter-call-log.dto';
import { CreateCallLogDto } from '../dtos/requests/create-call-log.dto';
import { UpdateCallLogDto } from '../dtos/requests/update-call-log.dto';
import { CallLogResponseDto } from '../dtos/responses/call-log-response.dto';
import { CallLogsService } from '../services/call-logs.service';

@Controller('call-logs')
export class CallLogsController {
  constructor(private readonly callLogsService: CallLogsService) {}

  @Post()
  @Protected(Permission.CREATE_CALL_LOG)
  @SerializeResponse(CallLogResponseDto)
  async create(@Body() createCallLogDto: CreateCallLogDto): Promise<CallLogResponseDto> {
    return this.callLogsService.create(createCallLogDto);
  }

  @Get()
  @Protected(Permission.READ_CALL_LOG)
  async findAll(
    @Query() filterDto: FilterCallLogDto,
  ): Promise<PaginationResponseDto<CallLogResponseDto>> {
    return this.callLogsService.findAll(filterDto);
  }

  @Get(':id')
  @Protected(Permission.READ_CALL_LOG)
  @SerializeResponse(CallLogResponseDto)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CallLogResponseDto> {
    return this.callLogsService.findOne(id, {
      relations: ['responsibleEmployee', 'externalParty', 'responsibleEmployee.person'],
    });
  }

  @Patch(':id')
  @Protected(Permission.UPDATE_CALL_LOG)
  @SerializeResponse(CallLogResponseDto)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCallLogDto: UpdateCallLogDto,
  ): Promise<CallLogResponseDto> {
    return this.callLogsService.update(id, updateCallLogDto);
  }

  @Delete(':id')
  @Protected(Permission.DELETE_CALL_LOG)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.callLogsService.delete(id);
  }
}
