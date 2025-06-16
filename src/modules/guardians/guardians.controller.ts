import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { GuardiansService } from './guardians.service';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { UpdateGuardianDto } from './dto/update-guardian.dto';
import { ResponseGuardianDto } from './dto/response-guardian.dto';
import { FilterGuardianDto } from './dto/filter-guardian.dto';

@Controller('guardians')
export class GuardiansController {
  constructor(private readonly guardiansService: GuardiansService) {}

  @Post()
  async create(@Body() createGuardianDto: CreateGuardianDto): Promise<ResponseGuardianDto> {
    const guardian = await this.guardiansService.create(createGuardianDto);
    return guardian;
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
