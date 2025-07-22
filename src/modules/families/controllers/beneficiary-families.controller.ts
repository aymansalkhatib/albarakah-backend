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
import { FamiliesService } from '../services/beneficiary-families.service';
import { FilterFamilyDto } from '../dtos/queries/filter-family.dto';
import { CreateFamilyDto } from '../dtos/requests/create-family-dto';

@Controller('families')
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Get()
  async findAll(@Query() filter: FilterFamilyDto): Promise<FamilyResponseDto[]> {
    const beneficiaryFamilies = await this.familiesService.findAll(filter);
    return toDto(FamilyResponseDto, beneficiaryFamilies);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<FamilyResponseDto> {
    const beneficiaryFamily = await this.familiesService.findOne(id);
    return toDto(FamilyResponseDto, beneficiaryFamily);
  }

  @Post()
  async create(@Body() createBeneficiaryFamilyDto: CreateFamilyDto): Promise<FamilyResponseDto> {
    const beneficiaryFamily = await this.familiesService.create(createBeneficiaryFamilyDto);
    return toDto(FamilyResponseDto, beneficiaryFamily);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateBeneficiaryFamilyDto: UpdateFamilyDto,
  ): Promise<FamilyResponseDto> {
    const beneficiaryFamily = await this.familiesService.update(id, updateBeneficiaryFamilyDto);
    return toDto(FamilyResponseDto, beneficiaryFamily);
  }

  @Delete(':id')
  async forceDelete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.familiesService.forceDelete(id);
    return {
      message: 'Beneficiary family deleted successfully',
    };
  }
}
