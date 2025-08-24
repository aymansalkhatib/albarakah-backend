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
import { Protected } from '../../../common/decorators/protected.decorator';
import { SerializeResponse } from '../../../common/decorators/serialize-response.decorator';
import { Permission } from '../../../modules/roles/enums/permission.enum';
import { HouseQueryDto } from '../dtos/queries/house-query.dto';
import { CreateHouseDto } from '../dtos/requests/create-house.dto';
import { UpdateHouseDto } from '../dtos/requests/update-house.dto';
import { HouseResponseDto } from '../dtos/responses/house-response.dto';
import { HousesService } from '../services/houses.service';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';

@Controller('houses')
export class HousesController {
  constructor(private readonly housesService: HousesService) {}

  @Post()
  @Protected(Permission.CREATE_HOUSE)
  @SerializeResponse(HouseResponseDto)
  async create(@Body() createHouseDto: CreateHouseDto): Promise<HouseResponseDto> {
    return await this.housesService.create(createHouseDto);
  }

  @Get()
  @Protected(Permission.READ_HOUSE)
  async findAll(@Query() query: HouseQueryDto): Promise<PaginationResponseDto<HouseResponseDto>> {
    return await this.housesService.findAll(query);
  }

  @Get(':id')
  @Protected(Permission.READ_HOUSE)
  @SerializeResponse(HouseResponseDto)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<HouseResponseDto> {
    return await this.housesService.findOne(id, {
      relations: ['family'],
    });
  }

  @Patch(':id')
  @Protected(Permission.UPDATE_HOUSE)
  @SerializeResponse(HouseResponseDto)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHouseDto: UpdateHouseDto,
  ): Promise<HouseResponseDto> {
    return await this.housesService.update(id, updateHouseDto);
  }

  @Delete(':id')
  @Protected(Permission.DELETE_HOUSE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.housesService.delete(id);
  }
}
