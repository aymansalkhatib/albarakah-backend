// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Person } from './entities/person.entity';
// import { CreatePersonDto } from './dto/create-person.dto';
// import { UpdatePersonDto } from './dto/update-person.dto';
// import { GenericFilterService } from 'src/common/filters/generic-filter.service';
// import { QueryParams, FilterResult } from 'src/common/filters/types';

// @Injectable()
// export class PersonService {
//   constructor(
//     @InjectRepository(Person)
//     private readonly personRepository: Repository<Person>,
//     private readonly genericFilterService: GenericFilterService,
//   ) {}

//   async create(createPersonDto: CreatePersonDto): Promise<Person> {
//     const person = this.personRepository.create(createPersonDto);
//     return this.personRepository.save(person);
//   }

//   async findAll(query: QueryParams): Promise<any> {
//     return await this.personRepository.find();
//     // You can add relations as needed
//     return this.genericFilterService.findWithFilters<Person>(
//       this.personRepository,
//       query,
//       [
//         'father',
//         'mother',
//         'educationLevel',
//         'maritalStatus',
//         'personStatus',
//         'schoolType',
//         'healthStatus',
//       ],
//       'person',
//     );
//   }

//   async findOne(id: number): Promise<Person> {
//     const person = await this.personRepository.findOne({
//       where: { id },
//       relations: [
//         'father',
//         'mother',
//         'educationLevel',
//         'maritalStatus',
//         'personStatus',
//         'schoolType',
//         'healthStatus',
//       ],
//     });
//     if (!person) {
//       throw new NotFoundException(`Person with id ${id} not found`);
//     }
//     return person;
//   }

//   async update(id: number, updatePersonDto: UpdatePersonDto): Promise<Person> {
//     const person = await this.personRepository.preload({ id, ...updatePersonDto });
//     if (!person) {
//       throw new NotFoundException(`Person with id ${id} not found`);
//     }
//     return this.personRepository.save(person);
//   }

//   async remove(id: number): Promise<void> {
//     const result = await this.personRepository.delete(id);
//     if (result.affected === 0) {
//       throw new NotFoundException(`Person with id ${id} not found`);
//     }
//   }
// }
