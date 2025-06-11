import { Injectable, NotFoundException, ConflictException, GoneException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './entities/person.entity';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PersonResponseDto } from './dto/person-response.dto';
import { PersonUniqueIdentifiers } from './type/person-unique-identifiers.type';
import { FilterPersonDto } from './dto/filter-person.dto';
// TODO remove insert father mother by create
// TODO in update can enter fatehr mother id he cant update father mother
@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  async findAll(filterDto: FilterPersonDto): Promise<Person[]> {
    const queryBuilder = this.personRepository.createQueryBuilder('person');

    // Apply filters based on FilterPersonDto
    if (filterDto.firstName) {
      queryBuilder.andWhere('person.firstName LIKE :firstName', {
        firstName: `%${filterDto.firstName}%`,
      });
    }

    if (filterDto.lastName) {
      queryBuilder.andWhere('person.lastName LIKE :lastName', {
        lastName: `%${filterDto.lastName}%`,
      });
    }

    if (filterDto.nationalId) {
      queryBuilder.andWhere('person.nationalId LIKE :nationalId', {
        nationalId: `%${filterDto.nationalId}%`,
      });
    }

    if (filterDto.email) {
      queryBuilder.andWhere('person.email LIKE :email', {
        email: `%${filterDto.email}%`,
      });
    }

    if (filterDto.phone) {
      queryBuilder.andWhere('person.phone LIKE :phone', {
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
      queryBuilder.andWhere('person.nationality LIKE :nationality', {
        nationality: `%${filterDto.nationality}%`,
      });
    }

    if (filterDto.birthDateFrom && filterDto.birthDateTo) {
      queryBuilder.andWhere('person.birthDate BETWEEN :birthDateFrom AND :birthDateTo', {
        birthDateFrom: filterDto.birthDateFrom,
        birthDateTo: filterDto.birthDateTo,
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

  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    if (createPersonDto.fatherId) {
      await this.findOne(createPersonDto.fatherId);
    }
    if (createPersonDto.motherId) {
      await this.findOne(createPersonDto.motherId);
    }
    //TODO dropdown

    // Validate person data
    await this.checkPersonExists(createPersonDto);

    // Create and save the person
    const person = this.personRepository.create(createPersonDto);
    const savedPerson = await this.personRepository.save(person);
    return this.findOne(savedPerson.id, { relations: ['father', 'mother'] });
  }

  async update(id: number, updatePersonDto: UpdatePersonDto): Promise<Person> {
    // Find the person to update
    const person = await this.findOne(id, { relations: ['father', 'mother'] });

    // Filter out unchanged fields to avoid unnecessary duplicate checks
    const cleanPersonDto = this.filterChangedPersonData(person, updatePersonDto);

    // Only check if there are actual changes to unique fields
    if (Object.keys(cleanPersonDto).length > 0) {
      await this.checkPersonExists(cleanPersonDto);
    }

    // Merge and save the updated person
    const mergedPerson = this.personRepository.merge(person, updatePersonDto);

    return await this.personRepository.save(mergedPerson);
  }

  async delete(id: number): Promise<{ message: string }> {
    const person = await this.findOne(id);
    await this.personRepository.delete(id);
    return {
      message: `Person ${person.firstName} ${person.lastName} has been deleted`,
    };
  }

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

    if (dto.firstName && dto.lastName) {
      personUniqueIdentifiers.fullNameAndBirth.push({
        firstName: dto.firstName,
        lastName: dto.lastName,
        birthDate: dto.birthDate ?? '',
      });
    }

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
    if (dto.firstName && dto.lastName) {
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
    }

    if (dto.father) {
      await this.checkPersonExists(dto.father);
    }
    if (dto.mother) {
      await this.checkPersonExists(dto.mother);
    }
  }

  filterChangedPersonData(existingPerson: any, updatePerson: any) {
    let changedFields = this.filterChangedFields(existingPerson, updatePerson);
    changedFields.father = this.filterChangedFields(existingPerson.father, updatePerson.father);
    changedFields.mother = this.filterChangedFields(existingPerson.mother, updatePerson.mother);
    return changedFields;
  }

  private filterChangedFields(existingPerson: any, updatePerson: any): any {
    if (!existingPerson || !updatePerson) return;
    const filteredData = {};
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
        filteredData[key] = newValue;
      }
    });
    return filteredData;
  }
}
