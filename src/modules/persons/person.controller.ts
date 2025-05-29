// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   Query,
//   UseFilters,
//   ParseIntPipe,
// } from '@nestjs/common';
// import { PersonService } from './person.service';
// import { CreatePersonDto } from './dto/create-person.dto';
// import { UpdatePersonDto } from './dto/update-person.dto';
// import { QueryParams } from 'src/common/filters/types';
// import { GlobalExceptionFilter } from 'src/shared/exceptions-filter/global-exception.filter';

// @Controller('persons')
// @UseFilters(GlobalExceptionFilter)
// export class PersonController {
//   constructor(private readonly personService: PersonService) {}

//   @Post()
//   async create(@Body() createPersonDto: CreatePersonDto) {
//     return this.personService.create(createPersonDto);
//   }

//   @Get()
//   async findAll(@Query() query: QueryParams) {
//     return this.personService.findAll(query);
//   }

//   @Get(':id')
//   async findOne(@Param('id', ParseIntPipe) id: number) {
//     return this.personService.findOne(id);
//   }

//   @Patch(':id')
//   async update(@Param('id', ParseIntPipe) id: number, @Body() updatePersonDto: UpdatePersonDto) {
//     return this.personService.update(id, updatePersonDto);
//   }

//   @Delete(':id')
//   async remove(@Param('id', ParseIntPipe) id: number) {
//     await this.personService.remove(id);
//     return { message: `Person with id ${id} deleted successfully` };
//   }
// }
