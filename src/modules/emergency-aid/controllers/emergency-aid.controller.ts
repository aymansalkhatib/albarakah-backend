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
import { EmergencyAidService } from '../services/emergency-aid.service';
import { CreateEmergencyAidDto } from '../dtos/requests/create-emergency-aid.dto';
import { EmergencyAidResponseDto } from '../dtos/responses/emergency-aid-response.dto';
import { UpdateEmergencyAidDto } from '../dtos/requests/update-emergency-aid.dto';
import { FilterEmergencyAidDto } from '../dtos/queries/filter-emergency-aid.dto';
import { SerializeResponse } from '@app/common/decorators/serialize-response.decorator';
import { PaginationResponseDto } from '@app/common/pagination/dto/pagination-response.dto';
import { Protected } from '@app/common/decorators/protected.decorator';
import { Permission } from '@app/modules/roles/enums/permission.enum';
import { toDto } from '@app/common/helpers/to-dto';

@Controller('emergency-aid-requests')
export class EmergencyAidController {
  constructor(private readonly emergencyAidService: EmergencyAidService) {}

  @Post()
  @Protected(Permission.CREATE_EMERGENCY_AID)
  @SerializeResponse(EmergencyAidResponseDto)
  async create(
    @Body() createEmergencyAidDto: CreateEmergencyAidDto,
  ): Promise<EmergencyAidResponseDto> {
    const emergencyAidRequest = await this.emergencyAidService.create(createEmergencyAidDto);
    return toDto(EmergencyAidResponseDto, emergencyAidRequest);
  }

  @Patch(':id')
  @Protected(Permission.UPDATE_EMERGENCY_AID)
  @SerializeResponse(EmergencyAidResponseDto)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmergencyAidDto: UpdateEmergencyAidDto,
  ): Promise<EmergencyAidResponseDto> {
    const emergencyAidRequest = this.emergencyAidService.update(id, updateEmergencyAidDto);
    return toDto(EmergencyAidResponseDto, emergencyAidRequest);
  }

  @Delete(':id')
  @Protected(Permission.DELETE_EMERGENCY_AID)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.emergencyAidService.delete(id);
  }

  @Get(':id')
  @Protected(Permission.READ_EMERGENCY_AID)
  @SerializeResponse(EmergencyAidResponseDto)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<EmergencyAidResponseDto> {
    const emergencyAidRequest = this.emergencyAidService.findOne(id, { relations: ['family'] });
    return toDto(EmergencyAidResponseDto, emergencyAidRequest);
  }

  @Get()
  @Protected(Permission.READ_EMERGENCY_AID)
  async findAll(
    @Query() filterDto: FilterEmergencyAidDto,
  ): Promise<PaginationResponseDto<EmergencyAidResponseDto>> {
    const emergencyAid = await this.emergencyAidService.findAll(filterDto);
    const transformedData = toDto(EmergencyAidResponseDto, emergencyAid.data);
    return new PaginationResponseDto(
      transformedData,
      emergencyAid.total,
      filterDto.page,
      filterDto.limit,
    );
  }

  @Patch(':id/approve')
  @Protected(Permission.APPROVE_EMERGENCY_AID)
  @SerializeResponse(EmergencyAidResponseDto)
  async approve(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { disbursedAmount?: number; notes?: string },
  ): Promise<EmergencyAidResponseDto> {
    const emergencyAidRequest = this.emergencyAidService.approve(
      id,
      body.disbursedAmount,
      body.notes,
    );
    return toDto(EmergencyAidResponseDto, emergencyAidRequest);
  }

  @Patch(':id/reject')
  @Protected(Permission.REJECT_EMERGENCY_AID)
  @SerializeResponse(EmergencyAidResponseDto)
  async reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { notes?: string },
  ): Promise<EmergencyAidResponseDto> {
    const emergencyAidRequest = this.emergencyAidService.reject(id, body.notes);
    return toDto(EmergencyAidResponseDto, emergencyAidRequest);
  }

  @Patch(':id/disburse')
  @Protected(Permission.DISBURSE_EMERGENCY_AID)
  @SerializeResponse(EmergencyAidResponseDto)
  async disburse(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { disbursedAmount?: number; notes?: string },
  ): Promise<EmergencyAidResponseDto> {
    const emergencyAidRequest = this.emergencyAidService.disburse(
      id,
      body.disbursedAmount,
      body.notes,
    );
    return toDto(EmergencyAidResponseDto, emergencyAidRequest);
  }

  @Patch(':id/cancel')
  @Protected(Permission.CANCEL_EMERGENCY_AID)
  @SerializeResponse(EmergencyAidResponseDto)
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { notes?: string },
  ): Promise<EmergencyAidResponseDto> {
    const emergencyAidRequest = await this.emergencyAidService.cancel(id, body.notes);
    return toDto(EmergencyAidResponseDto, emergencyAidRequest);
  }
}
