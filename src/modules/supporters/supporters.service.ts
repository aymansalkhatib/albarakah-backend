import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supporter } from './entities/supporters.entity';
import { CreateSupporterDto } from './dto/create-supporter.dto';
import { UpdateSupporterDto } from './dto/update-supporter.dto';
import { FilterSupporterDto } from './dto/filter-supporter.dto';
import { PersonsService } from '../persons/persons.service';
import { Person } from '../persons/entities/person.entity';
import { plainToInstance } from 'class-transformer';
import { ResponseSupporterDto } from './dto/response-supporter.dto';

@Injectable()
export class SupportersService {
  constructor(
    @InjectRepository(Supporter)
    private readonly supporterRepository: Repository<Supporter>,
    private readonly personsService: PersonsService,
  ) {}

  private transformToDto(supporter: Supporter): ResponseSupporterDto {
    return plainToInstance(
      ResponseSupporterDto,
      {
        ...supporter,
        supportStartDate: supporter.supportStartDate.toISOString().split('T')[0],
        supportEndDate: supporter.supportEndDate?.toISOString().split('T')[0],
      },
      { excludeExtraneousValues: true },
    );
  }

  private transformToDtoArray(supporters: Supporter[]): ResponseSupporterDto[] {
    return supporters.map((supporter) => this.transformToDto(supporter));
  }

  async create(createSupporterDto: CreateSupporterDto): Promise<ResponseSupporterDto> {
    let person: Person;

    if (createSupporterDto.personId) {
      person = await this.personsService.findOne(createSupporterDto.personId);

      const existingSupporter = await this.supporterRepository.findOne({
        where: { personId: person.id },
      });

      if (existingSupporter) {
        throw new ConflictException('This person is already a supporter');
      }
    } else {
      person = await this.personsService.create(createSupporterDto.person);
    }

    const supporterData = {
      ...createSupporterDto,
      personId: person.id,
      supportStartDate: createSupporterDto.supportStartDate.toISOString(),
      supportEndDate: createSupporterDto.supportEndDate?.toISOString(),
    };

    const supporter = this.supporterRepository.create(supporterData);
    const savedSupporter = await this.supporterRepository.save(supporter);
    return this.transformToDto(savedSupporter);
  }

  async findAll(filterDto: FilterSupporterDto): Promise<ResponseSupporterDto[]> {
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

    const supporters = await queryBuilder.getMany();
    return this.transformToDtoArray(supporters);
  }

  async findOne(
    id: number,
    { relations }: { relations?: string[] } = {},
  ): Promise<ResponseSupporterDto> {
    const supporter = await this.supporterRepository.findOne({
      where: { id },
      relations: relations || ['person'],
    });

    if (!supporter) {
      throw new NotFoundException(`Supporter with ID ${id} not found`);
    }

    return this.transformToDto(supporter);
  }

  async update(id: number, updateSupporterDto: UpdateSupporterDto): Promise<ResponseSupporterDto> {
    const supporter = await this.findOne(id, { relations: ['person'] });

    if (updateSupporterDto.person) {
      supporter.person = await this.personsService.update(
        supporter.person.id,
        updateSupporterDto.person,
      );
      delete updateSupporterDto.person;
    }

    const supporterData = {
      ...supporter,
      ...updateSupporterDto,
      supportStartDate:
        updateSupporterDto.supportStartDate?.toISOString() || supporter.supportStartDate,
      supportEndDate: updateSupporterDto.supportEndDate?.toISOString() || supporter.supportEndDate,
    };

    const updatedSupporter = this.supporterRepository.create(supporterData);
    const savedSupporter = await this.supporterRepository.save(updatedSupporter);
    return this.transformToDto(savedSupporter);
  }

  async remove(id: number): Promise<void> {
    const supporter = await this.findOne(id);
    await this.supporterRepository.softRemove(supporter);
  }

  async findByPersonId(personId: number): Promise<ResponseSupporterDto[]> {
    const supporters = await this.supporterRepository.find({
      where: { personId },
      relations: ['person'],
    });
    return this.transformToDtoArray(supporters);
  }
}
