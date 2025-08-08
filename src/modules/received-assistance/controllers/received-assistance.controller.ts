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
import { SerializeResponse } from '@app/common/decorators/serialize-response.decorator';
import { PaginationResponseDto } from '@app/common/pagination/dto/pagination-response.dto';
import { Protected } from '@app/common/decorators/protected.decorator';
import { Permission } from '@app/modules/roles/enums/permission.enum';
import { ReceivedAssistanceService } from '../services/received-assistance.service';
import { CreateReceivedAssistanceDto } from '@app/modules/received-assistance/dtos/requests/create-received-assistance.dto';
import { UpdateReceivedAssistanceDto } from '@app/modules/received-assistance/dtos/requests/update-received-assistance.dto';
import { FilterReceivedAssistanceDto } from '@app/modules/received-assistance/dtos/queries/filter-received-assistance.dto';
import { ReceivedAssistanceResponseDto } from '@app/modules/received-assistance/dtos/responses/received-assistance-response.dto';

@Controller('received-assistance')
export class ReceivedAssistanceController {
  constructor(private readonly receivedAssistanceService: ReceivedAssistanceService) {}

  @Post()
  @Protected(Permission.CREATE_RECEIVED_ASSISTANCE)
  @SerializeResponse(ReceivedAssistanceResponseDto)
  async create(
    @Body() createDto: CreateReceivedAssistanceDto,
  ): Promise<ReceivedAssistanceResponseDto> {
    return await this.receivedAssistanceService.create(createDto);
  }

  @Get(':id')
  @Protected(Permission.READ_RECEIVED_ASSISTANCE)
  @SerializeResponse(ReceivedAssistanceResponseDto)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ReceivedAssistanceResponseDto> {
    return await this.receivedAssistanceService.findOne(id, {
      relations: ['family', 'familyMember'],
    });
  }

  @Get()
  @Protected(Permission.READ_RECEIVED_ASSISTANCE)
  async findAll(
    @Query() filterDto: FilterReceivedAssistanceDto,
  ): Promise<PaginationResponseDto<ReceivedAssistanceResponseDto>> {
    return await this.receivedAssistanceService.findAll(filterDto);
  }

  @Patch(':id')
  @Protected(Permission.UPDATE_RECEIVED_ASSISTANCE)
  @SerializeResponse(ReceivedAssistanceResponseDto)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateReceivedAssistanceDto,
  ): Promise<ReceivedAssistanceResponseDto> {
    return await this.receivedAssistanceService.update(id, updateDto);
  }

  @Delete(':id')
  @Protected(Permission.DELETE_RECEIVED_ASSISTANCE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.receivedAssistanceService.delete(id);
  }
}
