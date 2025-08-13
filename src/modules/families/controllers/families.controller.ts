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
import { UpdateFamilyDto } from '../dtos/requests/update-family-dto';
import { FamilyResponseDto } from '../dtos/responses/family-response.dto';
import { FamiliesService } from '../services/families.service';
import { FilterFamilyDto } from '../dtos/queries/filter-family.dto';
import { CreateFamilyDto } from '../dtos/requests/create-family-dto';
import { Protected } from '../../../common/decorators/protected.decorator';
import { Permission } from '../../../modules/roles/enums/permission.enum';
import { SerializeResponse } from '../../../common/decorators/serialize-response.decorator';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';

@Controller('families')
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Post()
  @Protected(Permission.CREATE_FAMILY)
  @SerializeResponse(FamilyResponseDto)
  async create(@Body() createFamilyDto: CreateFamilyDto): Promise<FamilyResponseDto> {
    return await this.familiesService.create(createFamilyDto);
  }

  @Get()
  @Protected(Permission.READ_FAMILY)
  async findAll(
    @Query() filter: FilterFamilyDto,
  ): Promise<PaginationResponseDto<FamilyResponseDto>> {
    return await this.familiesService.findAll(filter);
  }

  @Get(':id')
  @Protected(Permission.READ_FAMILY)
  @SerializeResponse(FamilyResponseDto)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<FamilyResponseDto> {
    return await this.familiesService.findOne(id);
  }

  @Patch(':id')
  @Protected(Permission.UPDATE_FAMILY)
  @SerializeResponse(FamilyResponseDto)
  async update(
    @Param('id') id: number,
    @Body() updatefamilyDto: UpdateFamilyDto,
  ): Promise<FamilyResponseDto> {
    return await this.familiesService.update(id, updatefamilyDto);
  }

  @Delete(':id')
  @Protected(Permission.DELETE_FAMILY)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.familiesService.delete(id);
  }
}
