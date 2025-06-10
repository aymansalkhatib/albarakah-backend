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

  async checkPersonExists(dto: CreatePersonDto | UpdatePersonDto): Promise<void> {
    const identifiers = await this.collectFamilyIdentifiers(dto, {
      emails: [],
      fullNameAndBirth: [],
      nationalIds: [],
    });
    await this.validateFamilyIdentifiers(identifiers);
    await this.validatePersonInDatabase(dto);
  }

  private async collectFamilyIdentifiers(
    dto: CreatePersonDto | UpdatePersonDto,
    personUniqueIdentifiers: PersonUniqueIdentifiers,
  ): Promise<PersonUniqueIdentifiers> {
    if (dto.email) {
      personUniqueIdentifiers.emails.push(dto.email);
    }

    if (dto.nationalId) {
      personUniqueIdentifiers.nationalIds.push(dto.nationalId);
    }

    personUniqueIdentifiers.fullNameAndBirth.push({
      firstName: dto.firstName,
      lastName: dto.lastName,
      birthDate: dto.birthDate ?? '',
    });

    if (dto.father) {
      await this.collectFamilyIdentifiers(dto.father, personUniqueIdentifiers);
    }

    if (dto.mother) {
      await this.collectFamilyIdentifiers(dto.mother, personUniqueIdentifiers);
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
  private async validatePersonInDatabase(dto: CreatePersonDto | UpdatePersonDto): Promise<void> {
    // Check by nationalId if provided
    if (dto.nationalId) {
      const existingByNationalId = await this.personRepository.exists({
        where: { nationalId: dto.nationalId },
      });
      if (existingByNationalId) {
        throw new ConflictException(`Person with national ID ${dto.nationalId} already exists`);
      }
    }

    // Check by email if provided
    if (dto.email) {
      const existingByEmail = await this.personRepository.exists({
        where: { email: dto.email },
      });
      if (existingByEmail) {
        throw new ConflictException(`Person with email ${dto.email} already exists`);
      }
    }

    // Check by firstName, lastName, and birthDate combination
    const existingByFullNameAndBirth = await this.personRepository.exists({
      where: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        birthDate: dto.birthDate,
      },
    });
    if (existingByFullNameAndBirth) {
      throw new ConflictException(
        `Person with name ${dto.firstName} ${dto.lastName} and birth date ${dto.birthDate} already exists`,
      );
    }

    if (dto.father) {
      await this.checkPersonExists(dto.father);
    }
    if (dto.mother) {
      await this.checkPersonExists(dto.mother);
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

  getUniqueFieldsChanged(existingPerson: any, updatePerson: any): any {
    const cleanDto = {};
    Object.keys(updatePerson).forEach((key) => {
      const newValue = updatePerson[key];
      const existingValue = existingPerson[key];
      // Remove unique fields (email, nationalId) and composite fields (firstName, lastName, birthDate)
      // since they will be validated against the database for duplicates
      // If duplicates are found, an exception will be thrown
      if (
        newValue !== undefined &&
        newValue !== null &&
        newValue !== existingValue &&
        !['email', 'nationalId', 'firstName', 'lastName', 'birthDate'].includes(key)
      ) {
        cleanDto[key] = newValue;
      }
    });
    return cleanDto;
  }
}
