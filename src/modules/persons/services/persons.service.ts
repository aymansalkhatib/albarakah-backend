import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Person } from '../entities/person.entity';
import { UpdatePersonDto } from '../dtos/requests/update-person.dto';
import { validateDropdownFields, validatePersonUniqueness } from '../utils/person.validation';
import { FilterPersonDto } from '../dtos/queries/filter-person.dto';
import { CreatePersonDto } from '../dtos/requests/create-person.dto';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';
import { DropdownService } from '../../../modules/dropdowns/services/dropdown.service';
import { PersonRelation } from '../enums/person-relation.enum';
import { paginate } from '../../../common/pagination/paginate.service';
import { PersonResponseDto } from '../dtos/responses/person-response.dto';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { applyPersonFilters } from '../utils/person-filter.util';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly translateHelper: TranslateHelper,
    private readonly dropdownService: DropdownService,
  ) {}

  async create(createPersonDto: CreatePersonDto, entityManager?: EntityManager): Promise<Person> {
    const repository = entityManager ? entityManager.getRepository(Person) : this.personRepository;

    await validatePersonUniqueness(this.translateHelper, repository, createPersonDto, undefined);

    await validateDropdownFields(createPersonDto, this.dropdownService);

    const person = repository.create(createPersonDto);
    const savedPerson = await repository.save(person);
    return savedPerson;
  }

  async createWithTransaction(
    createPersonDto: CreatePersonDto,
    entityManager: EntityManager,
  ): Promise<Person> {
    return this.create(createPersonDto, entityManager);
  }

  async createManyWithTransaction(
    createPersonDtos: CreatePersonDto[],
    entityManager: EntityManager,
  ): Promise<Person[]> {
    const createdPersons: Person[] = [];

    for (const createPersonDto of createPersonDtos) {
      const person = await this.create(createPersonDto, entityManager);
      createdPersons.push(person);
    }

    return createdPersons;
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
    applyPersonFilters(queryBuilder, 'person', filterDto);
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
