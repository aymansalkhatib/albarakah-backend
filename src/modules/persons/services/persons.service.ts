import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOneOptions, Repository } from 'typeorm';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { paginate } from '../../../common/pagination/paginate.service';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';
import { FilterPersonDto } from '../dtos/queries/filter-person.dto';
import { CreatePersonDto } from '../dtos/requests/create-person.dto';
import { UpdatePersonDto } from '../dtos/requests/update-person.dto';
import { PersonResponseDto } from '../dtos/responses/person-response.dto';
import { Person } from '../entities/person.entity';
import { PersonRelation } from '../enums/person-relation.enum';
import { applyPersonFilters } from '../utils/person-filter.util';
import { validatePersonUniqueness } from '../utils/person.validation';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly translateHelper: TranslateHelper,
  ) {}

  async create(
    createPersonDto: CreatePersonDto,
    entityManager?: EntityManager,
  ): Promise<Person> {
    const repository = entityManager
      ? entityManager.getRepository(Person)
      : this.personRepository;

    await validatePersonUniqueness(
      this.translateHelper,
      repository,
      createPersonDto,
      undefined,
    );

    const person = repository.create(createPersonDto);
    const savedPerson = await repository.save(person);
    return savedPerson;
  }

  async update(
    id: number,
    updatePersonDto: UpdatePersonDto,
    entityManager?: EntityManager,
  ): Promise<Person> {
    const repository = entityManager
      ? entityManager.getRepository(Person)
      : this.personRepository;

    const person = await this.findOne(id, undefined, entityManager);
    const mergedPerson = repository.merge(person, updatePersonDto);

    await validatePersonUniqueness(
      this.translateHelper,
      repository,
      mergedPerson,
      id,
    );

    const savedPerson = await repository.save(mergedPerson);
    return this.findOne(savedPerson.id, undefined, entityManager);
  }

  async delete(id: number): Promise<void> {
    const result = await this.personRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        this.translateHelper.tr('persons.errors.not_found', { id }),
      );
    }
  }

  async deleteIf(id: number, type: PersonRelation): Promise<void> {
    const person = await this.findOne(id, {
      relations: Object.values(PersonRelation),
    });

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

  async findOne(
    id: number,
    options: FindOneOptions<Person> = {},
    entityManager?: EntityManager,
  ): Promise<Person> {
    const personRepository =
      entityManager?.getRepository(Person) ?? this.personRepository;

    const person = await personRepository.findOne({
      where: { id },
      ...options,
    });

    if (!person) {
      throw new NotFoundException(
        this.translateHelper.tr('persons.errors.not_found', { id }),
      );
    }

    return person;
  }

  async findAll(
    filterDto: FilterPersonDto,
  ): Promise<PaginationResponseDto<PersonResponseDto>> {
    const queryBuilder = this.personRepository.createQueryBuilder('person');
    applyPersonFilters(queryBuilder, 'person', filterDto);
    return paginate(queryBuilder, filterDto, PersonResponseDto);
  }

  async findOneByName(name: string): Promise<Person> {
    const person = await this.personRepository.findOne({
      where: { fullName: name },
    });

    if (!person) {
      throw new NotFoundException(
        this.translateHelper.tr('persons.errors.not_found_by_name', { name }),
      );
    }

    return person;
  }
}
