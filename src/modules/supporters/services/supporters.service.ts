import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supporter } from '../entities/supporters.entity';
import { CreateSupporterDto } from '../dtos/create-supporter.dto';
import { UpdateSupporterDto } from '../dtos/update-supporter.dto';
import { FilterSupporterDto } from '../dtos/filter-supporter.dto';
import { SupporterResponseDto } from '../dtos/supporter-response.dto';
import { PersonsService } from '@app/modules/persons/services/persons.service';
import { Person } from '@app/modules/persons/entities/person.entity';
import { TranslateHelper } from '@app/shared/modules/app-i18n/translate.helper';
import { PersonRelation } from '@app/modules/persons/enums/person-relation.enum';
import { PaginationResponseDto } from '@app/common/pagination/dto/pagination-response.dto';
import { paginate } from '@app/common/pagination/paginate.service';

@Injectable()
export class SupportersService {
  constructor(
    @InjectRepository(Supporter)
    private readonly supporterRepository: Repository<Supporter>,
    private readonly personsService: PersonsService,
    private readonly translateHelper: TranslateHelper,
  ) {}

  async create(createSupporterDto: CreateSupporterDto): Promise<Supporter> {
    let person: Person;

    if (createSupporterDto.personId) {
      person = await this.personsService.findOne(createSupporterDto.personId, {
        relations: ['supporter'],
      });

      if (person.supporter) {
        throw new ConflictException(this.translateHelper.tr('supporters.errors.already_supporter'));
      }
    } else {
      person = await this.personsService.create(createSupporterDto.person);
    }

    const supporter = this.supporterRepository.create({
      ...createSupporterDto,
      person,
    });
    return this.supporterRepository.save(supporter);
  }

  async findAll(
    filterDto: FilterSupporterDto,
  ): Promise<PaginationResponseDto<SupporterResponseDto>> {
    const queryBuilder = this.supporterRepository
      .createQueryBuilder('supporter')
      .leftJoinAndSelect('supporter.person', 'person');

    if (filterDto.supportType) {
      queryBuilder.andWhere('supporter.supportType = :supportType', {
        supportType: filterDto.supportType,
      });
    }

    if (filterDto.supportStartDateFrom) {
      queryBuilder.andWhere('supporter.supportStartDate >= :from', {
        from: filterDto.supportStartDateFrom,
      });
    }

    if (filterDto.supportStartDateTo) {
      queryBuilder.andWhere('supporter.supportStartDate <= :to', {
        to: filterDto.supportStartDateTo,
      });
    }

    if (filterDto.supportEndDateFrom) {
      queryBuilder.andWhere('supporter.supportEndDate >= :from', {
        from: filterDto.supportEndDateFrom,
      });
    }

    if (filterDto.supportEndDateTo) {
      queryBuilder.andWhere('supporter.supportEndDate <= :to', {
        to: filterDto.supportEndDateTo,
      });
    }

    if (filterDto.search) {
      queryBuilder.andWhere(
        '(person.firstName LIKE :search OR person.lastName LIKE :search OR supporter.notes LIKE :search)',
        { search: `%${filterDto.search}%` },
      );
    }

    // Add person filters
    if (filterDto.person) {
      if (filterDto.person.firstName) {
        queryBuilder.andWhere('person.firstName LIKE :firstName', {
          firstName: `%${filterDto.person.firstName}%`,
        });
      }

      if (filterDto.person.lastName) {
        queryBuilder.andWhere('person.lastName LIKE :lastName', {
          lastName: `%${filterDto.person.lastName}%`,
        });
      }

      if (filterDto.person.nationalId) {
        queryBuilder.andWhere('person.nationalId LIKE :nationalId', {
          nationalId: `%${filterDto.person.nationalId}%`,
        });
      }

      if (filterDto.person.isPalestinian !== undefined) {
        queryBuilder.andWhere('person.isPalestinian = :isPalestinian', {
          isPalestinian: filterDto.person.isPalestinian,
        });
      }

      if (filterDto.person.gender) {
        queryBuilder.andWhere('person.gender = :gender', {
          gender: filterDto.person.gender,
        });
      }

      if (filterDto.person.nationality) {
        queryBuilder.andWhere('person.nationality ILIKE :nationality', {
          nationality: `%${filterDto.person.nationality}%`,
        });
      }

      if (filterDto.person.phone) {
        queryBuilder.andWhere('person.phone LIKE :phone', {
          phone: `%${filterDto.person.phone}%`,
        });
      }

      if (filterDto.person.email) {
        queryBuilder.andWhere('person.email LIKE :email', {
          email: `%${filterDto.person.email}%`,
        });
      }

      if (filterDto.person.birthDateFrom && filterDto.person.birthDateTo) {
        queryBuilder.andWhere('person.birthDate BETWEEN :birthDateFrom AND :birthDateTo', {
          birthDateFrom: filterDto.person.birthDateFrom,
          birthDateTo: filterDto.person.birthDateTo,
        });
      } else if (filterDto.person.birthDateFrom) {
        queryBuilder.andWhere('person.birthDate >= :birthDateFrom', {
          birthDateFrom: filterDto.person.birthDateFrom,
        });
      } else if (filterDto.person.birthDateTo) {
        queryBuilder.andWhere('person.birthDate <= :birthDateTo', {
          birthDateTo: filterDto.person.birthDateTo,
        });
      }
    }

    return paginate(queryBuilder, filterDto, SupporterResponseDto);
  }

  async findOne(id: number, { relations }: { relations?: string[] } = {}): Promise<Supporter> {
    const supporter = await this.supporterRepository.findOne({
      where: { id },
      relations: relations || ['person'],
    });

    if (!supporter) {
      throw new NotFoundException(this.translateHelper.tr('supporters.errors.not_found', { id }));
    }

    return supporter;
  }

  async update(id: number, updateSupporterDto: UpdateSupporterDto): Promise<Supporter> {
    const supporter = await this.findOne(id, { relations: ['person'] });

    if (updateSupporterDto.person) {
      supporter.person = await this.personsService.update(
        supporter.person.id,
        updateSupporterDto.person,
      );
      delete updateSupporterDto.person;
    }

    this.supporterRepository.merge(supporter, updateSupporterDto);
    return await this.supporterRepository.save(supporter);
  }

  async delete(id: number): Promise<void> {
    const supporter = await this.findOne(id);
    await this.supporterRepository.delete(id);
    await this.personsService.deleteIf(supporter.personId, PersonRelation.SUPPORTER);
  }
}
