import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from '../entities/person.entity';
import { UpdatePersonDto } from '../dtos/requests/update-person.dto';
import { validateDropdownFields, validatePersonUniqueness } from '../utils/person.validation';
import { FilterPersonDto } from '../dtos/queries/filter-person.dto';
import { CreatePersonDto } from '../dtos/requests/create-person.dto';
import { TranslateHelper } from '@app/shared/modules/app-i18n/translate.helper';
import { DropdownService } from '@app/modules/dropdowns/services/dropdown.service';
import { PersonRelation } from '../enums/person-relation.enum';
import { paginate } from '@app/common/pagination/paginate.service';
import { PersonResponseDto } from '../dtos/responses/person-response.dto';
import { PaginationResponseDto } from '@app/common/pagination/dto/pagination-response.dto';

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

    await validateDropdownFields(createPersonDto, this.dropdownService);

    const person = this.personRepository.create(createPersonDto);
    const savedPerson = await this.personRepository.save(person);
    return this.findOne(savedPerson.id);
  }

  async update(id: number, updatePersonDto: UpdatePersonDto): Promise<Person> {
    const person = await this.findOne(id);
    const mergedPerson = this.personRepository.merge(person, updatePersonDto);

    await validatePersonUniqueness(this.translateHelper, this.personRepository, mergedPerson, id);

    await validateDropdownFields(updatePersonDto, this.dropdownService);

    const savedPerson = await this.personRepository.save(mergedPerson);
    return this.findOne(savedPerson.id);
  }

  async delete(id: number): Promise<void> {
    const result = await this.personRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(this.translateHelper.tr('persons.errors.not_found', { id }));
    }
  }

  async deleteIf(id: number, type: PersonRelation): Promise<void> {
    const person = await this.findOne(id, { relations: Object.values(PersonRelation) });

    const hasOtherRelations = Object.values(PersonRelation).some((relation) => {
      if (relation === type) return false;
      const value = person[relation];
      if (Array.isArray(value)) return value.length > 0;
      return value != null;
    });

    if (!hasOtherRelations) {
      await this.delete(id);
    }
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

  async findAll(filterDto: FilterPersonDto): Promise<PaginationResponseDto<PersonResponseDto>> {
    const queryBuilder = this.personRepository.createQueryBuilder('person');

    // Apply filters based on FilterPersonDto
    if (filterDto.firstName) {
      queryBuilder.andWhere('person.firstName ILIKE :firstName', {
        firstName: `%${filterDto.firstName}%`,
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
    } else if (filterDto.birthDateFrom) {
      queryBuilder.andWhere('person.birthDate >= :birthDateFrom', {
        birthDateFrom: filterDto.birthDateFrom,
      });
    } else if (filterDto.birthDateTo) {
      queryBuilder.andWhere('person.birthDate <= :birthDateTo', {
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

    return paginate(queryBuilder, filterDto, PersonResponseDto);
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
}
