import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { SupportersService } from './supporters.service';
import { CreateSupporterDto } from './dto/create-supporter.dto';
import { UpdateSupporterDto } from './dto/update-supporter.dto';
import { ResponseSupporterDto } from './dto/response-supporter.dto';
import { FilterSupporterDto } from './dto/filter-supporter.dto';

@Controller('supporters')
export class SupportersController {
  constructor(private readonly supportersService: SupportersService) {}

  @Post()
  async create(@Body() createSupporterDto: CreateSupporterDto): Promise<ResponseSupporterDto> {
    const supporter = await this.supportersService.create(createSupporterDto);
    return supporter;
  }

  @Get()
  async findAll(@Query() filterDto: FilterSupporterDto): Promise<ResponseSupporterDto[]> {
    return await this.supportersService.findAll(filterDto);
  }

  @Get('by-person/:personId')
  async findByPersonId(
    @Param('personId', ParseIntPipe) personId: number,
  ): Promise<ResponseSupporterDto[]> {
    return await this.supportersService.findByPersonId(personId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseSupporterDto> {
    return await this.supportersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSupporterDto: UpdateSupporterDto,
  ): Promise<ResponseSupporterDto> {
    return await this.supportersService.update(id, updateSupporterDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.supportersService.remove(id);
  }
}
