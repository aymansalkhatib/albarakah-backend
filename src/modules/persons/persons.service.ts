import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './entities/person.entity';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { FilterPersonDto } from './dto/filter-person.dto';
import { validatePersonUniqueness, validateFamilyRelationships } from './utils/person.validation';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    validateFamilyRelationships(null, createPersonDto, null);

    const validationPromises = [];

    if (createPersonDto.fatherId) {
      validationPromises.push(this.findOne(createPersonDto.fatherId));
    }

    if (createPersonDto.motherId) {
      validationPromises.push(this.findOne(createPersonDto.motherId));
    }

    validationPromises.push(validatePersonUniqueness(this.personRepository, createPersonDto));

    (await Promise.allSettled(validationPromises)).forEach((r) => {
      if (r.status === 'rejected') throw r.reason;
    });

    const person = this.personRepository.create(createPersonDto);
    const savedPerson = await this.personRepository.save(person);
    return this.findOne(savedPerson.id, { relations: ['father', 'mother'] });
  }

  async update(id: number, updatePersonDto: UpdatePersonDto): Promise<Person> {
    const person = await this.findOne(id);
    const mergedPerson = this.personRepository.merge(person, updatePersonDto);

    validateFamilyRelationships(id, updatePersonDto, person);

    const validationPromises = [];

    if (updatePersonDto.fatherId) {
      validationPromises.push(this.findOne(updatePersonDto.fatherId));
    }
    if (updatePersonDto.motherId) {
      validationPromises.push(this.findOne(updatePersonDto.motherId));
    }
    validationPromises.push(validatePersonUniqueness(this.personRepository, mergedPerson, id));

    (await Promise.allSettled(validationPromises)).forEach((r) => {
      if (r.status === 'rejected') throw r.reason;
    });

    const savedPerson = await this.personRepository.save(mergedPerson);
    return this.findOne(savedPerson.id, { relations: ['father', 'mother'] });
  }

  async delete(id: number): Promise<{ message: string }> {
    const person = await this.findOne(id);
    await this.personRepository.delete(id);
    return {
      message: `Person ${person.firstName} ${person.lastName} has been deleted`,
    };
  }

  async findAll(filterDto: FilterPersonDto): Promise<Person[]> {
    const queryBuilder = this.personRepository.createQueryBuilder('person');

    // Apply filters based on FilterPersonDto
    if (filterDto.firstName) {
      queryBuilder.andWhere('person.firstName ILIKE :firstName', {
        firstName: `%${filterDto.firstName}%`,
      });
    }

    if (filterDto.fatherFirstName) {
      queryBuilder.leftJoin('person.father', 'father');
      queryBuilder.andWhere('father.firstName ILIKE :fatherFirstName', {
        fatherFirstName: `%${filterDto.fatherFirstName}%`,
      });
    }

    if (filterDto.motherFirstName) {
      queryBuilder.leftJoin('person.mother', 'mother');
      queryBuilder.andWhere('mother.firstName ILIKE :motherFirstName', {
        motherFirstName: `%${filterDto.motherFirstName}%`,
      });
    }

    if (filterDto.lastName) {
      queryBuilder.andWhere('person.lastName ILIKE :lastName', {
        lastName: `%${filterDto.lastName}%`,
      });
    }

    if (filterDto.nationalId) {
      queryBuilder.andWhere('person.nationalId ILIKE :nationalId', {
        nationalId: `%${filterDto.nationalId}%`,
      });
    }

    if (filterDto.email) {
      queryBuilder.andWhere('person.email ILIKE :email', {
        email: `%${filterDto.email}%`,
      });
    }

    if (filterDto.phone) {
      queryBuilder.andWhere('person.phone ILIKE :phone', {
        phone: `%${filterDto.phone}%`,
      });
    }

    if (filterDto.isPalestinian !== undefined) {
      queryBuilder.andWhere('person.isPalestinian = :isPalestinian', {
        isPalestinian: filterDto.isPalestinian,
      });
    }

    if (filterDto.gender) {
      queryBuilder.andWhere('person.gender = :gender', {
        gender: filterDto.gender,
      });
    }

    if (filterDto.nationality) {
      queryBuilder.andWhere('person.nationality ILIKE :nationality', {
        nationality: `%${filterDto.nationality}%`,
      });
    }

    if (filterDto.birthDateFrom && filterDto.birthDateTo) {
      queryBuilder.andWhere('person.birthDate BETWEEN :birthDateFrom AND :birthDateTo', {
        birthDateFrom: filterDto.birthDateFrom,
        birthDateTo: filterDto.birthDateTo,
      });
    }

    if (filterDto.fatherId) {
      queryBuilder.andWhere('person.fatherId = :fatherId', {
        fatherId: filterDto.fatherId,
      });
    }

    if (filterDto.motherId) {
      queryBuilder.andWhere('person.motherId = :motherId', {
        motherId: filterDto.motherId,
      });
    }

    // Add more filters as needed based on FilterPersonDto

    return await queryBuilder.getMany();
  }

  async findOne(id: number, { relations }: { relations?: (keyof Person)[] } = {}): Promise<Person> {
    const person = await this.personRepository.findOne({
      where: { id },
      relations: relations || [],
    });

    if (!person) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }

    return person;
  }
}
