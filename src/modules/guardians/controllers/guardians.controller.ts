import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FilterGuardianDto } from '../dtos/queries/filter-guardian.dto';
import { CreateGuardianDto } from '../dtos/requests/create-guardian.dto';
import { UpdateGuardianDto } from '../dtos/requests/update-guardian.dto';
import { GuardianResponseDto } from '../dtos/responses/guardian-response.dto';
import { GuardiansService } from '../services/guardians.service';
import { SerializeResponse } from '../../../common/decorators/serialize-response.decorator';
import { Protected } from '../../../common/decorators/protected.decorator';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { Permission } from '../../roles/enums/permission.enum';

@Controller('guardians')
export class GuardiansController {
  constructor(private readonly guardiansService: GuardiansService) {}

  @Post()
  @SerializeResponse(GuardianResponseDto)
  @Protected(Permission.CREATE_GUARDIAN)
  async create(@Body() createGuardianDto: CreateGuardianDto): Promise<GuardianResponseDto> {
    return await this.guardiansService.create(createGuardianDto);
  }

  @Get()
  @Protected(Permission.READ_GUARDIAN)
  async findAll(
    @Query() filterDto: FilterGuardianDto,
  ): Promise<PaginationResponseDto<GuardianResponseDto>> {
    return await this.guardiansService.findAll(filterDto);
  }

  @Get(':id')
  @SerializeResponse(GuardianResponseDto)
  @Protected(Permission.READ_GUARDIAN)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<GuardianResponseDto> {
    return await this.guardiansService.findOne(id, { relations: ['person', 'family'] });
  }

  @Patch(':id')
  @SerializeResponse(GuardianResponseDto)
  @Protected(Permission.UPDATE_GUARDIAN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGuardianDto: UpdateGuardianDto,
  ): Promise<GuardianResponseDto> {
    return await this.guardiansService.update(id, updateGuardianDto);
  }

  @Delete(':id')
  @Protected(Permission.DELETE_GUARDIAN)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.guardiansService.delete(id);
  }
}
