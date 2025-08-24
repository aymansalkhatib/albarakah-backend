import {
  Body,
  Controller,
  // Delete,
  Get,
  // HttpCode,
  // HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  // Post,
  Query,
} from '@nestjs/common';
import { PersonsService } from '../services/persons.service';
import { UpdatePersonDto } from '../dtos/requests/update-person.dto';
import { FilterPersonDto } from '../dtos/queries/filter-person.dto';
// import { CreatePersonDto } from '../dtos/requests/create-person.dto';
import { PersonResponseDto } from '../dtos/responses/person-response.dto';
import { SerializeResponse } from '../../../common/decorators/serialize-response.decorator';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { Protected } from '../../../common/decorators/protected.decorator';
import { Permission } from '../../../modules/roles/enums/permission.enum';

@Controller('persons')
export class PersonController {
  constructor(private readonly personsService: PersonsService) {}

  // @Post()
  // @Protected(Permission.CREATE_PERSON)
  // @SerializeResponse(PersonResponseDto)
  // async create(@Body() createPersonDto: CreatePersonDto): Promise<PersonResponseDto> {
  //   return this.personsService.create(createPersonDto);
  // }

  @Patch(':id')
  @Protected(Permission.UPDATE_PERSON)
  @SerializeResponse(PersonResponseDto)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePersonDto: UpdatePersonDto,
  ): Promise<PersonResponseDto> {
    return this.personsService.update(id, updatePersonDto);
  }

  // @Delete(':id')
  // @Protected(Permission.DELETE_PERSON)
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async delete(@Param('id', ParseIntPipe) id: number) {
  //   return this.personsService.delete(id);
  // }

  @Get(':id')
  @Protected(Permission.READ_PERSON)
  @SerializeResponse(PersonResponseDto)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PersonResponseDto> {
    return this.personsService.findOne(id, { relations: ['father', 'mother'] });
  }

  @Get()
  @Protected(Permission.READ_PERSON)
  async findAll(
    @Query() filterDto: FilterPersonDto,
  ): Promise<PaginationResponseDto<PersonResponseDto>> {
    return this.personsService.findAll(filterDto);
  }
}
