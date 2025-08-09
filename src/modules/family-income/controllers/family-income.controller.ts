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
  Put,
  Query,
} from '@nestjs/common';
import { CreateFamilyIncomeDto } from '../dtos/requests/create-family-income.dto';
import { FamilyIncomeService } from '../services/family-income.service';
import { FamilyIncomeResponseDto } from '../dtos/responses/family-income-response.dto';
import { FilterFamilyIncomeDto } from '../dtos/queries/filter-family-income.dto';
import { UpdateFamilyIncomeDto } from '../dtos/requests/update-family-income.dto';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { SerializeResponse } from '../../../common/decorators/serialize-response.decorator';
import { Protected } from '../../../common/decorators/protected.decorator';
import { Permission } from '../../../modules/roles/enums/permission.enum';

@Controller('family-income')
export class FamilyIncomeController {
  constructor(private readonly familyIncomeService: FamilyIncomeService) {}

  @Post()
  @SerializeResponse(FamilyIncomeResponseDto)
  @Protected(Permission.CREATE_FAMILY_INCOME)
  async create(
    @Body() createFamilyIncomeDto: CreateFamilyIncomeDto,
  ): Promise<FamilyIncomeResponseDto> {
    return await this.familyIncomeService.create(createFamilyIncomeDto);
  }

  @Get()
  @Protected(Permission.READ_FAMILY_INCOME)
  async findAll(
    @Query() filterDto: FilterFamilyIncomeDto,
  ): Promise<PaginationResponseDto<FamilyIncomeResponseDto>> {
    return await this.familyIncomeService.findAll(filterDto);
  }

  @Get(':id')
  @SerializeResponse(FamilyIncomeResponseDto)
  @Protected(Permission.READ_FAMILY_INCOME)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<FamilyIncomeResponseDto> {
    return await this.familyIncomeService.findOne(id, {
      relations: ['family', 'familyMember'],
    });
  }

  @Patch(':id')
  @SerializeResponse(FamilyIncomeResponseDto)
  @Protected(Permission.UPDATE_FAMILY_INCOME)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateFamilyIncomeDto,
  ): Promise<FamilyIncomeResponseDto> {
    return await this.familyIncomeService.update(id, updateData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Protected(Permission.DELETE_FAMILY_INCOME)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.familyIncomeService.delete(id);
  }
}
