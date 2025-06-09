import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './entities/person.entity';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PersonResponseDto } from './dto/person-response.dto';
import { PersonUniqueIdentifiers } from './type/person-unique-identifiers.type';
import { preferences } from 'joi';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  async checkPersonExists(createPersonDto: CreatePersonDto): Promise<void> {
    const identifiers = await this.collectFamilyIdentifiers(createPersonDto, {
      emails: [],
      fullNameAndBirth: [],
      nationalIds: [],
    });
    await this.validateFamilyIdentifiers(identifiers);
    await this.validatePersonInDatabase(createPersonDto);
  }

  private async collectFamilyIdentifiers(
    person: CreatePersonDto,
    personUniqueIdentifiers: PersonUniqueIdentifiers,
  ): Promise<PersonUniqueIdentifiers> {
    if (person.email) {
      personUniqueIdentifiers.emails.push(person.email);
    }

    if (person.nationalId) {
      personUniqueIdentifiers.nationalIds.push(person.nationalId);
    }

    personUniqueIdentifiers.fullNameAndBirth.push({
      firstName: person.firstName,
      lastName: person.lastName,
      birthDate: person.birthDate ?? '',
    });

    if (person.father) {
      await this.collectFamilyIdentifiers(person.father, personUniqueIdentifiers);
    }

    if (person.mother) {
      await this.collectFamilyIdentifiers(person.mother, personUniqueIdentifiers);
    }

    return personUniqueIdentifiers;
  }
  private async validateFamilyIdentifiers(identifiers: PersonUniqueIdentifiers): Promise<void> {
    // Check for duplicate emails
    const uniqueEmails = new Set(identifiers.emails);
    if (uniqueEmails.size !== identifiers.emails.length) {
      throw new ConflictException('Duplicate emails found in family tree');
    }

    // Check for duplicate national IDs
    const uniqueNationalIds = new Set(identifiers.nationalIds);
    if (uniqueNationalIds.size !== identifiers.nationalIds.length) {
      throw new ConflictException('Duplicate national IDs found in family tree');
    }

    // Check for duplicate full name and birth date combinations
    const uniqueFullNameAndBirth = new Set(
      identifiers.fullNameAndBirth.map(
        (item) => `${item.firstName}-${item.lastName}-${item.birthDate}`,
      ),
    );
    if (uniqueFullNameAndBirth.size !== identifiers.fullNameAndBirth.length) {
      throw new ConflictException(
        'Duplicate person found: Same first name, last name and birth date combination exists in family tree',
      );
    }
  }

  private async validatePersonInDatabase(createPersonDto: CreatePersonDto): Promise<void> {
    // Check by nationalId if provided
    if (createPersonDto.nationalId) {
      const existingByNationalId = await this.personRepository.exists({
        where: { nationalId: createPersonDto.nationalId },
      });
      if (existingByNationalId) {
        throw new ConflictException(
          `Person with national ID ${createPersonDto.nationalId} already exists`,
        );
      }
    }

    // Check by email if provided
    if (createPersonDto.email) {
      const existingByEmail = await this.personRepository.exists({
        where: { email: createPersonDto.email },
      });
      if (existingByEmail) {
        throw new ConflictException(`Person with email ${createPersonDto.email} already exists`);
      }
    }

    // Check by firstName, lastName, and birthDate combination
    const existingByFullNameAndBirth = await this.personRepository.exists({
      where: {
        firstName: createPersonDto.firstName,
        lastName: createPersonDto.lastName,
        birthDate: createPersonDto.birthDate,
      },
    });
    if (existingByFullNameAndBirth) {
      throw new ConflictException(
        `Person with name ${createPersonDto.firstName} ${createPersonDto.lastName} and birth date ${createPersonDto.birthDate} already exists`,
      );
    }

    if (createPersonDto.father) {
      await this.checkPersonExists(createPersonDto.father);
    }
    if (createPersonDto.mother) {
      await this.checkPersonExists(createPersonDto.mother);
    }
  }

  async findOne(id: number, relations?: string[]): Promise<Person> {
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
