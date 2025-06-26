import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { PersonsService } from '../services/persons.service';
import { UpdatePersonDto } from '../dtos/requests/update-person.dto';
import { FilterPersonDto } from '../dtos/queries/filter-person.dto';
import { CreatePersonDto } from '../dtos/requests/create-person.dto';
import { PersonResponseDto } from '../dtos/responses/person-response.dto';

@Controller('persons')
@UseInterceptors(PersonResponseDto)
export class PersonController {
  constructor(private readonly personsService: PersonsService) {}

  @Post()
  async create(@Body() createPersonDto: CreatePersonDto) {
    return this.personsService.create(createPersonDto);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personsService.update(id, updatePersonDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.personsService.delete(id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.personsService.findOne(id, { relations: ['father', 'mother'] });
  }

  @Get()
  async findAll(@Query() filterDto: FilterPersonDto) {
    return this.personsService.findAll(filterDto);
  }
}
