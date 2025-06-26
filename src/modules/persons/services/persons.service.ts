import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from '../entities/person.entity';
import { UpdatePersonDto } from '../dtos/requests/update-person.dto';
import { validateFamilyRelationships, validatePersonUniqueness } from '../utils/person.validation';
import { FilterPersonDto } from '../dtos/queries/filter-person.dto';
import { CreatePersonDto } from '../dtos/requests/create-person.dto';
import { TranslateHelper } from '@app/shared/modules/app-i18n/translate.helper';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly translateHelper: TranslateHelper,
  ) {}

  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    validateFamilyRelationships(this.translateHelper, null, createPersonDto, null);

    const validationPromises = [];

    if (createPersonDto.fatherId) {
      validationPromises.push(this.findOne(createPersonDto.fatherId));
    }

    if (createPersonDto.motherId) {
      validationPromises.push(this.findOne(createPersonDto.motherId));
    }

    validationPromises.push(
      validatePersonUniqueness(
        this.translateHelper,
        this.personRepository,
        createPersonDto,
        undefined,
      ),
    );

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

    validateFamilyRelationships(this.translateHelper, id, updatePersonDto, person);

    const validationPromises = [];

    if (updatePersonDto.fatherId) {
      validationPromises.push(this.findOne(updatePersonDto.fatherId));
    }
    if (updatePersonDto.motherId) {
      validationPromises.push(this.findOne(updatePersonDto.motherId));
    }
    validationPromises.push(
      validatePersonUniqueness(this.translateHelper, this.personRepository, mergedPerson, id),
    );

    (await Promise.allSettled(validationPromises)).forEach((r) => {
      if (r.status === 'rejected') throw r.reason;
    });

    const savedPerson = await this.personRepository.save(mergedPerson);
    return this.findOne(savedPerson.id, { relations: ['father', 'mother'] });
  }

  async delete(id: number): Promise<{ message: string }> {
    const person = await this.findOne(id, {
      relations: ['employee', 'child', 'familyMember', 'guardian'],
    });

    const relatedData: string[] = [];

    if (person.employee) relatedData.push(`Employee record (ID: ${person.employee.id})`);

    if (person.child) relatedData.push(`Child record (ID: ${person.child.id})`);

    if (person.familyMember)
      relatedData.push(`Family member record (ID: ${person.familyMember.id})`);

    if (person.guardian) relatedData.push(`Guardian record (ID: ${person.guardian.id})`);

    if (relatedData.length > 0) {
      const relationsList = relatedData.join(', ');
      throw new ConflictException(
        this.translateHelper.tr('persons.errors.cannot_delete_related', {
          firstName: person.firstName,
          lastName: person.lastName,
          relationsList,
        }),
      );
    }

    await this.personRepository.delete(id);
    return {
      message: this.translateHelper.tr('persons.success.deleted', {
        firstName: person.firstName,
        lastName: person.lastName,
      }),
    };
  }

  async findOne(id: number, { relations }: { relations?: string[] } = {}): Promise<Person> {
    const person = await this.personRepository.findOne({
      where: { id },
      relations: relations || [],
    });

    if (!person) {
      throw new NotFoundException(this.translateHelper.tr('persons.errors.not_found', { id }));
    }

    return person;
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

    return await queryBuilder.getMany();
  }
}
