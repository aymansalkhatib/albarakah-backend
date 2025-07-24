import { toDto } from '@app/common/helpers/to-dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateFamilyIncomeDto } from '../dtos/requests/create-family-income.dto';
import { FamilyIncomeService } from '../services/family-income.service';
import { FamilyIncomeResponseDto } from '../dtos/responses/family-income-response.dto';
import { FilterFamilyIncomeDto } from '../dtos/queries/filter-family-income.dto';
import { UpdateFamilyIncomeDto } from '../dtos/requests/update-family-income.dto';

@Controller('family-income')
export class FamilyIncomeController {
  constructor(private readonly familyIncomeService: FamilyIncomeService) {}

  @Get()
  async findAll(@Query() filterDto: FilterFamilyIncomeDto): Promise<FamilyIncomeResponseDto[]> {
    const familyIncomes = await this.familyIncomeService.findAll(filterDto);
    return toDto(FamilyIncomeResponseDto, familyIncomes.data, { enableImplicitConversion: true });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<FamilyIncomeResponseDto> {
    const familyIncome = await this.familyIncomeService.findOne(id);
    return toDto(FamilyIncomeResponseDto, familyIncome);
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
    @Body() updateData: UpdateFamilyIncomeDto,
  ): Promise<FamilyIncomeResponseDto> {
    const familyIncome = await this.familyIncomeService.update(id, updateData);
    return toDto(FamilyIncomeResponseDto, familyIncome);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.familyIncomeService.delete(id);
  }

  @Get('family/:familyId/total')
  async getFamilyTotalIncome(
    @Param('familyId', ParseIntPipe) familyId: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ total: number }> {
    let total: number;

    if (startDate && endDate) {
      total = await this.familyIncomeService.getTotalIncomeByFamilyIdAndDateRange(
        familyId,
        new Date(startDate),
        new Date(endDate),
      );
    } else {
      total = await this.familyIncomeService.getTotalIncomeByFamilyId(familyId);
    }

    return { total };
  }
}
