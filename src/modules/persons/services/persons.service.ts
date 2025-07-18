import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from '../entities/person.entity';
import { UpdatePersonDto } from '../dtos/requests/update-person.dto';
import { validatePersonUniqueness } from '../utils/person.validation';
import { FilterPersonDto } from '../dtos/queries/filter-person.dto';
import { CreatePersonDto } from '../dtos/requests/create-person.dto';
import { TranslateHelper } from '@app/shared/modules/app-i18n/translate.helper';
import { DropdownService } from '@app/modules/dropdowns/services/dropdown.service';
import { PersonDropdown } from '../enums/type-dropdown.enum';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly translateHelper: TranslateHelper,
    private readonly dropdownService: DropdownService,
  ) {}

  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    await validatePersonUniqueness(
      this.translateHelper,
      this.personRepository,
      createPersonDto,
      undefined,
    );

    await this.validateDropdownFields(createPersonDto);

    const person = this.personRepository.create(createPersonDto);
    const savedPerson = await this.personRepository.save(person);
    return this.findOne(savedPerson.id);
  }

  async update(id: number, updatePersonDto: UpdatePersonDto): Promise<Person> {
    const person = await this.findOne(id);
    const mergedPerson = this.personRepository.merge(person, updatePersonDto);

    const validationPromises = [];

    if (updatePersonDto.fatherName) {
      validationPromises.push(this.findOneByName(updatePersonDto.fatherName));
    }
    if (updatePersonDto.motherName) {
      validationPromises.push(this.findOneByName(updatePersonDto.motherName));
    }
    validationPromises.push(
      validatePersonUniqueness(this.translateHelper, this.personRepository, mergedPerson, id),
    );

    (await Promise.allSettled(validationPromises)).forEach((r) => {
      if (r.status === 'rejected') throw r.reason;
    });

    await this.validateDropdownFields(updatePersonDto);

    const savedPerson = await this.personRepository.save(mergedPerson);
    return this.findOne(savedPerson.id);
  }

  async delete(id: number): Promise<void> {
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

    if (filterDto.fatherName) {
      queryBuilder.andWhere('person.fatherName ILIKE :fatherName', {
        fatherName: `%${filterDto.fatherName}%`,
      });
    }

    if (filterDto.motherName) {
      queryBuilder.andWhere('person.motherName ILIKE :motherName', {
        motherName: `%${filterDto.motherName}%`,
      });
    }

    return await queryBuilder.getMany();
  }

  async findOneByName(name: string): Promise<Person> {
    const person = await this.personRepository.findOne({
      where: { firstName: name },
    });

    if (!person) {
      throw new NotFoundException(`Person not found by name: ${name}`);
    }

    return person;
  }

  async validateDropdownFields(dto: CreatePersonDto | UpdatePersonDto) {
    if (dto.healthStatusId) {
      await this.dropdownService.findDropdownWithOptionCheck({
        categoryName: Person.name,
        dropdownName: PersonDropdown.HEALTH_STATUS,
        optionId: dto.healthStatusId,
      });
    }

    if (dto.educationLevelId) {
      await this.dropdownService.findDropdownWithOptionCheck({
        categoryName: Person.name,
        dropdownName: PersonDropdown.EDUCATION_LEVEL,
        optionId: dto.educationLevelId,
      });
    }

    if (dto.schoolTypeId) {
      await this.dropdownService.findDropdownWithOptionCheck({
        categoryName: Person.name,
        dropdownName: PersonDropdown.SCHOOL_TYPE,
        optionId: dto.schoolTypeId,
      });
    }

    if (dto.personStatusId) {
      await this.dropdownService.findDropdownWithOptionCheck({
        categoryName: Person.name,
        dropdownName: PersonDropdown.PERSON_STATUS,
        optionId: dto.personStatusId,
      });
    }

    if (dto.maritalStatusId) {
      await this.dropdownService.findDropdownWithOptionCheck({
        categoryName: Person.name,
        dropdownName: PersonDropdown.MARITAL_STATUS,
        optionId: dto.maritalStatusId,
      });
    }

    if (dto.gradeLevelId) {
      await this.dropdownService.findDropdownWithOptionCheck({
        categoryName: Person.name,
        dropdownName: PersonDropdown.GRADE_LEVEL,
        optionId: dto.gradeLevelId,
      });
    }
  }
}
