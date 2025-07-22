import { toDto } from '@app/common/helpers/to-dto';
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
import { CreateFamilyIncomeDto } from '../dtos/create-family-income.dto';
import { FamilyIncomeResponseDto } from '../dtos/family-income-response.dto';
import { FamilyIncomeService } from '../services/family-income.service';

@Controller('family-income')
export class FamilyIncomeController {
  constructor(private readonly familyIncomeService: FamilyIncomeService) {}

  @Get()
  async findAll(): Promise<FamilyIncomeResponseDto[]> {
    const familyIncomes = await this.familyIncomeService.findAll();
    return toDto(FamilyIncomeResponseDto, familyIncomes);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<FamilyIncomeResponseDto> {
    const familyIncome = await this.familyIncomeService.findOne(id);
    return toDto(FamilyIncomeResponseDto, familyIncome);
  }

  @Get('family/:familyId')
  async findByFamilyId(
    @Param('familyId', ParseIntPipe) familyId: number,
  ): Promise<FamilyIncomeResponseDto[]> {
    const familyIncomes = await this.familyIncomeService.findByFamilyId(familyId);
    return toDto(FamilyIncomeResponseDto, familyIncomes);
  }

  @Get('family/:familyId/date-range')
  async findByFamilyIdAndDateRange(
    @Param('familyId', ParseIntPipe) familyId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<FamilyIncomeResponseDto[]> {
    const familyIncomes = await this.familyIncomeService.findByFamilyIdAndDateRange(
      familyId,
      new Date(startDate),
      new Date(endDate),
    );
    return toDto(FamilyIncomeResponseDto, familyIncomes);
  }

  @Get('source/:incomeSource')
  async findByIncomeSource(
    @Param('incomeSource') incomeSource: string,
  ): Promise<FamilyIncomeResponseDto[]> {
    const familyIncomes = await this.familyIncomeService.findByIncomeSource(incomeSource);
    return toDto(FamilyIncomeResponseDto, familyIncomes);
  }

  @Post()
  async create(
    @Body() createFamilyIncomeDto: CreateFamilyIncomeDto,
  ): Promise<FamilyIncomeResponseDto> {
    const familyIncome = await this.familyIncomeService.create(createFamilyIncomeDto);
    return toDto(FamilyIncomeResponseDto, familyIncome);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateFamilyIncomeDto>,
  ): Promise<FamilyIncomeResponseDto> {
    const familyIncome = await this.familyIncomeService.update(id, updateData);
    return toDto(FamilyIncomeResponseDto, familyIncome);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.familyIncomeService.delete(id);
    return {
      message: 'Family income record deleted successfully',
    };
  }

  @Delete(':id/force')
  async forceDelete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.familyIncomeService.forceDelete(id);
    return {
      message: 'Family income record permanently deleted',
    };
  }

  @Get('family/:familyId/total')
  async getTotalIncomeByFamilyId(
    @Param('familyId', ParseIntPipe) familyId: number,
  ): Promise<{ total: number }> {
    const total = await this.familyIncomeService.getTotalIncomeByFamilyId(familyId);
    return { total };
  }

  @Get('family/:familyId/total/date-range')
  async getTotalIncomeByFamilyIdAndDateRange(
    @Param('familyId', ParseIntPipe) familyId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<{ total: number }> {
    const total = await this.familyIncomeService.getTotalIncomeByFamilyIdAndDateRange(
      familyId,
      new Date(startDate),
      new Date(endDate),
    );
    return { total };
  }
}
