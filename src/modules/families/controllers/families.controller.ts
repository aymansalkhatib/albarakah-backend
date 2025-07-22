import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UpdateFamilyDto } from '../dtos/requests/update-family-dto';
import { FamilyResponseDto } from '../dtos/responses/family-response.dto';

import { toDto } from '../../../common/helpers/to-dto';
import { FamiliesService } from '../services/families.service';
import { FilterFamilyDto } from '../dtos/queries/filter-family.dto';
import { CreateFamilyDto } from '../dtos/requests/create-family-dto';

@Controller('families')
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Get()
  async findAll(@Query() filter: FilterFamilyDto): Promise<FamilyResponseDto[]> {
    const families = await this.familiesService.findAll(filter);
    return toDto(FamilyResponseDto, families);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<FamilyResponseDto> {
    const family = await this.familiesService.findOne(id);
    return toDto(FamilyResponseDto, family);
  }

  @Post()
  async create(@Body() createFamilyDto: CreateFamilyDto): Promise<FamilyResponseDto> {
    const family = await this.familiesService.create(createFamilyDto);
    return toDto(FamilyResponseDto, family);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updatefamilyDto: UpdateFamilyDto,
  ): Promise<FamilyResponseDto> {
    const family = await this.familiesService.update(id, updatefamilyDto);
    return toDto(FamilyResponseDto, family);
  }

  @Delete(':id')
  async forceDelete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.familiesService.forceDelete(id);
    return {
      message: 'family deleted successfully',
    };
  }
}
