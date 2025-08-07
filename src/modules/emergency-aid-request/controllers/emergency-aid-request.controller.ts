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
import { EmergencyAidRequestService } from '../services/emergency-aid-request.service';
import { CreateEmergencyAidRequestDto } from '../dtos/requests/create-emergency-aid-request.dto';
import { EmergencyAidRequestResponseDto } from '../dtos/responses/emergency-aid-request-response.dto';
import { UpdateEmergencyAidRequestDto } from '../dtos/requests/update-emergency-aid-request.dto';
import { FilterEmergencyAidRequestDto } from '../dtos/queries/filter-emergency-aid-request.dto';
import { SerializeResponse } from '@app/common/decorators/serialize-response.decorator';
import { PaginationResponseDto } from '@app/common/pagination/dto/pagination-response.dto';
import { Protected } from '@app/common/decorators/protected.decorator';
import { Permission } from '@app/modules/roles/enums/permission.enum';

@Controller('emergency-aid-requests')
export class EmergencyAidRequestController {
  constructor(private readonly emergencyAidRequestService: EmergencyAidRequestService) {}

  @Post()
  @Protected(Permission.CREATE_EMERGENCY_AID)
  @SerializeResponse(EmergencyAidRequestResponseDto)
  async create(
    @Body() createEmergencyAidDto: CreateEmergencyAidRequestDto,
  ): Promise<EmergencyAidRequestResponseDto> {
    return await this.emergencyAidRequestService.create(createEmergencyAidDto);
  }

  @Get(':id')
  @Protected(Permission.READ_EMERGENCY_AID)
  @SerializeResponse(EmergencyAidRequestResponseDto)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<EmergencyAidRequestResponseDto> {
    return await this.emergencyAidRequestService.findOne(id, {
      relations: ['family'],
    });
  }

  @Get()
  @Protected(Permission.READ_EMERGENCY_AID)
  async findAll(
    @Query() filterDto: FilterEmergencyAidRequestDto,
  ): Promise<PaginationResponseDto<EmergencyAidRequestResponseDto>> {
    return await this.emergencyAidRequestService.findAll(filterDto);
  }

  @Patch(':id')
  @Protected(Permission.UPDATE_EMERGENCY_AID)
  @SerializeResponse(EmergencyAidRequestResponseDto)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmergencyAidDto: UpdateEmergencyAidRequestDto,
  ): Promise<EmergencyAidRequestResponseDto> {
    return await this.emergencyAidRequestService.update(id, updateEmergencyAidDto);
  }

  @Delete(':id')
  @Protected(Permission.DELETE_EMERGENCY_AID)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.emergencyAidRequestService.delete(id);
  }
}
