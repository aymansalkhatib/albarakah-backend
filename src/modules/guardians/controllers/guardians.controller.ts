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
import { ResponseGuardianDto } from '../dtos/responses/response-guardian.dto';
import { GuardiansService } from '../services/guardians.service';

@Controller('guardians')
export class GuardiansController {
  constructor(private readonly guardiansService: GuardiansService) {}

  @Post()
  async create(@Body() createGuardianDto: CreateGuardianDto): Promise<ResponseGuardianDto> {
    return await this.guardiansService.create(createGuardianDto);
  }

  @Get()
  async findAll(@Query() filterDto: FilterGuardianDto): Promise<ResponseGuardianDto[]> {
    return await this.guardiansService.findAll(filterDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseGuardianDto> {
    return await this.guardiansService.findOne(id);
  }

  @Get('person/:personId')
  async findByPersonId(
    @Param('personId', ParseIntPipe) personId: number,
  ): Promise<ResponseGuardianDto[]> {
    return await this.guardiansService.findByPersonId(personId);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGuardianDto: UpdateGuardianDto,
  ): Promise<ResponseGuardianDto> {
    return await this.guardiansService.update(id, updateGuardianDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.guardiansService.remove(id);
  }
}
