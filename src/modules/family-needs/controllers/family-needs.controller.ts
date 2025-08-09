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
import { FamilyNeedsService } from '../services/family-needs.service';
import { CreateFamilyNeedDto } from '../dtos/requests/create-family-need.dto';
import { UpdateFamilyNeedDto } from '../dtos/requests/update-family-need.dto';
import { FilterFamilyNeedDto } from '../dtos/queries/filter-family-need.dto';
import { FamilyNeedResponseDto } from '../dtos/responses/family-need-response.dto';
import { Protected } from '../../../common/decorators/protected.decorator';
import { Permission } from '../../../modules/roles/enums/permission.enum';
import { SerializeResponse } from '../../../common/decorators/serialize-response.decorator';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';

@Controller('family-needs')
export class FamilyNeedsController {
  constructor(private readonly familyNeedsService: FamilyNeedsService) {}

  @Post()
  @Protected(Permission.CREATE_FAMILY_NEED)
  @SerializeResponse(FamilyNeedResponseDto)
  async create(@Body() createFamilyNeedDto: CreateFamilyNeedDto): Promise<FamilyNeedResponseDto> {
    return await this.familyNeedsService.create(createFamilyNeedDto);
  }

  @Get()
  @Protected(Permission.READ_FAMILY_NEED)
  async findAll(
    @Query() filter: FilterFamilyNeedDto,
  ): Promise<PaginationResponseDto<FamilyNeedResponseDto>> {
    return await this.familyNeedsService.findAll(filter);
  }

  @Get(':id')
  @Protected(Permission.READ_FAMILY_NEED)
  @SerializeResponse(FamilyNeedResponseDto)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<FamilyNeedResponseDto> {
    return await this.familyNeedsService.findOne(id, {
      relations: ['family', 'familyMember', 'familyMember.person'],
    });
  }

  @Patch(':id')
  @Protected(Permission.UPDATE_FAMILY_NEED)
  @SerializeResponse(FamilyNeedResponseDto)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFamilyNeedDto: UpdateFamilyNeedDto,
  ): Promise<FamilyNeedResponseDto> {
    return await this.familyNeedsService.update(id, updateFamilyNeedDto);
  }

  @Delete(':id')
  @Protected(Permission.DELETE_FAMILY_NEED)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.familyNeedsService.delete(id);
  }
}
