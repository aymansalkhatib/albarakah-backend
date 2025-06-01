import { Controller, Get, Query } from '@nestjs/common';
import { SearchPersonDto } from './dto/search-person.dto';
import { PersonService } from './person.service';
@Controller('persons')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get('search')
  async searchPerson(@Query() searchDto: SearchPersonDto) {
    return this.personService.searchPerson(searchDto);
  }
}
