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
  Query,
} from '@nestjs/common';
import { SerializeResponse } from '../../../common/decorators/serialize-response.decorator';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { FamilyRegistrationFormFilterDto } from '../dtos/queries/family-registration-form-filter.dto';
import { CreateFamilyRegistrationFormDto } from '../dtos/requests/create-family-registration-form.dto';
import { UpdateFamilyRegistrationFormDto } from '../dtos/requests/update-family-registration-form.dto';
import { FamilyRegistrationFormResponseDto } from '../dtos/responses/family-registration-form-response.dto';
import { FamilyRegistrationFormsService } from '../services/family-registration-forms.service';

@Controller('family-registration-forms')
export class FamilyRegistrationFormsController {
  constructor(private readonly familyRegistrationFormsService: FamilyRegistrationFormsService) {}

  @Post()
  @SerializeResponse(FamilyRegistrationFormResponseDto)
  async create(
    @Body() createDto: CreateFamilyRegistrationFormDto,
  ): Promise<FamilyRegistrationFormResponseDto> {
    return await this.familyRegistrationFormsService.create(createDto);
  }

  @Get()
  async findAll(
    @Query() filter: FamilyRegistrationFormFilterDto,
  ): Promise<PaginationResponseDto<FamilyRegistrationFormResponseDto>> {
    return await this.familyRegistrationFormsService.findAll(filter);
  }

  @Get(':id')
  @SerializeResponse(FamilyRegistrationFormResponseDto)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<FamilyRegistrationFormResponseDto> {
    return await this.familyRegistrationFormsService.findOne(id);
  }

  @Patch(':id')
  @SerializeResponse(FamilyRegistrationFormResponseDto)
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateFamilyRegistrationFormDto,
  ): Promise<FamilyRegistrationFormResponseDto> {
    return await this.familyRegistrationFormsService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.familyRegistrationFormsService.delete(id);
  }
}
