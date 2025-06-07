import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
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

import { toDto } from 'src/common/helpers/to-dto';
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
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.beneficiaryFamiliesService.remove(id);
    return {
      message: 'Beneficiary family deleted successfully',
    };
  }

  @Delete('/:id/force')
  async forceDelete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.beneficiaryFamiliesService.forceDelete(id);
    return {
      message: 'Beneficiary family deleted successfully',
    };
  }

  @Post('/:id/restore')
  async restore(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.beneficiaryFamiliesService.restore(id);
    return {
      message: 'Beneficiary family restored successfully',
    };
  }
}