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
import { BeneficiaryFamiliesService } from './beneficiary-families.service';
import { CreateBeneficiaryFamilyDto } from './dto/create-beneficiary-family-dto';
import { UpdateBeneficiaryFamilyDto } from './dto/update-beneficiary-family-dto';
import { BeneficiaryFamilyResponseDto } from './dto/beneficiary-family-response.dto';

import { toDto } from '../../common/helpers/to-dto';
import { FilterBeneficiaryFamilyDto } from './dto/filter-beneficiary-family.dto';

@Controller('beneficiary-families')
export class BeneficiaryFamiliesController {
  constructor(private readonly beneficiaryFamiliesService: BeneficiaryFamiliesService) {}

  @Get()
  async findAll(
    @Query() filter: FilterBeneficiaryFamilyDto,
  ): Promise<BeneficiaryFamilyResponseDto[]> {
    const beneficiaryFamilies = await this.beneficiaryFamiliesService.findAll(filter);
    return toDto(BeneficiaryFamilyResponseDto, beneficiaryFamilies);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<BeneficiaryFamilyResponseDto> {
    const beneficiaryFamily = await this.beneficiaryFamiliesService.findOne(id);
    return toDto(BeneficiaryFamilyResponseDto, beneficiaryFamily);
  }

  @Post()
  async create(
    @Body() createBeneficiaryFamilyDto: CreateBeneficiaryFamilyDto,
  ): Promise<BeneficiaryFamilyResponseDto> {
    const beneficiaryFamily = await this.beneficiaryFamiliesService.create(
      createBeneficiaryFamilyDto,
    );
    return toDto(BeneficiaryFamilyResponseDto, beneficiaryFamily);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateBeneficiaryFamilyDto: UpdateBeneficiaryFamilyDto,
  ): Promise<BeneficiaryFamilyResponseDto> {
    const beneficiaryFamily = await this.beneficiaryFamiliesService.update(
      id,
      updateBeneficiaryFamilyDto,
    );
    return toDto(BeneficiaryFamilyResponseDto, beneficiaryFamily);
  }

  @Delete(':id')
  async forceDelete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.beneficiaryFamiliesService.forceDelete(id);
    return {
      message: 'Beneficiary family deleted successfully',
    };
  }
}
