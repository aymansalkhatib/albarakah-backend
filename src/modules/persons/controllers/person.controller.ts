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
  UseInterceptors,
} from '@nestjs/common';
import { PersonsService } from '../services/persons.service';
import { UpdatePersonDto } from '../dtos/requests/update-person.dto';
import { FilterPersonDto } from '../dtos/queries/filter-person.dto';
import { CreatePersonDto } from '../dtos/requests/create-person.dto';
import { PersonResponseDto } from '../dtos/responses/person-response.dto';
import { SerializeResponse } from '@app/common/decorators/serialize-response.decorator';

@Controller('persons')
@SerializeResponse(PersonResponseDto)
export class PersonController {
  constructor(private readonly personsService: PersonsService) {}

  @Post()
  async create(@Body() createPersonDto: CreatePersonDto): Promise<PersonResponseDto> {
    return this.personsService.create(createPersonDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePersonDto: UpdatePersonDto,
  ): Promise<PersonResponseDto> {
    return this.personsService.update(id, updatePersonDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.personsService.delete(id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PersonResponseDto> {
    return this.personsService.findOne(id, { relations: ['father', 'mother'] });
  }

  @Get()
  async findAll(@Query() filterDto: FilterPersonDto): Promise<PersonResponseDto[]> {
    return this.personsService.findAll(filterDto);
  }
}
