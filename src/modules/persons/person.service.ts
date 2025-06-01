import { Injectable } from '@nestjs/common';

import { SearchPersonDto } from './dto/search-person.dto';

@Injectable()
export class PersonService {
  constructor() {}

  async searchPerson(searchDto: SearchPersonDto) {}
}
