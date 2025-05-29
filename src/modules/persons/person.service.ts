import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './entities/person.entity';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { QueryBuilderUtil } from 'src/utils/query-builder.util';
import { PaginationResult } from 'src/shared/pagination/dto/interfaces/pagination.interface';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    const person = this.personRepository.create(createPersonDto);
    return this.personRepository.save(person);
  }

  async findAll(relations: string[] = []): Promise<PaginationResult<Person>> {
    return QueryBuilderUtil.paginate(
      this.personRepository.createQueryBuilder('person'),
      { page: 1, limit: 10 },
      ['createdAt'],
      { field: 'createdAt', order: 'DESC' }, // default sort
    );
  }

  async findOne(id: number): Promise<Person> {
    const person = await this.personRepository.findOne({
      where: { id },
      relations: [
        'father',
        'mother',
        'educationLevel',
        'maritalStatus',
        'personStatus',
        'schoolType',
        'healthStatus',
      ],
    });
    if (!person) {
      throw new NotFoundException(`Person with id ${id} not found`);
    }
    return person;
  }

  async update(id: number, updatePersonDto: UpdatePersonDto): Promise<Person> {
    const person = await this.personRepository.preload({ id, ...updatePersonDto });
    if (!person) {
      throw new NotFoundException(`Person with id ${id} not found`);
    }
    return this.personRepository.save(person);
  }

  async remove(id: number): Promise<void> {
    const result = await this.personRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Person with id ${id} not found`);
    }
  }
}
