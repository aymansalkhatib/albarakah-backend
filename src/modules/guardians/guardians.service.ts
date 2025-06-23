import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guardian } from 'src/modules/guardians/entities/guardian.entity';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { UpdateGuardianDto } from './dto/update-guardian.dto';
import { FilterGuardianDto } from './dto/filter-guardian.dto';
import { PersonsService } from '../persons/persons.service';
import { Person } from '../persons/entities/person.entity';

@Injectable()
export class GuardiansService {
  constructor(
    @InjectRepository(Guardian)
    private readonly guardianRepository: Repository<Guardian>,
    private readonly personsService: PersonsService,
  ) {}

  async create(createGuardianDto: CreateGuardianDto): Promise<Guardian> {
    let person: Person;

    if (createGuardianDto.personId) {
      person = await this.personsService.findOne(createGuardianDto.personId, {
        relations: ['guardian'],
      });

      if (person.guardian) {
        throw new ConflictException('This person is already a guardian');
      }
    } else {
      person = await this.personsService.create(createGuardianDto.person);
    }

    const guardianData = {
      ...createGuardianDto,
      personId: person.id,
      guardianshipStartDate: createGuardianDto.guardianshipStartDate.toISOString().split('T')[0],
      guardianshipEndDate: createGuardianDto.guardianshipEndDate?.toISOString().split('T')[0],
    };

    const guardian = this.guardianRepository.create(guardianData);
    return await this.guardianRepository.save(guardian);
  }

  async findAll(filterDto: FilterGuardianDto): Promise<Guardian[]> {
    const queryBuilder = this.guardianRepository
      .createQueryBuilder('guardian')
      .leftJoinAndSelect('guardian.person', 'person')
      .leftJoinAndSelect('guardian.families', 'families');

    if (filterDto.relationType) {
      queryBuilder.andWhere('guardian.relationType = :relationType', {
        relationType: filterDto.relationType,
      });
    }

    if (filterDto.guardianshipStartDateFrom) {
      queryBuilder.andWhere('guardian.guardianshipStartDate >= :from', {
        from: filterDto.guardianshipStartDateFrom,
      });
    }

    if (filterDto.guardianshipStartDateTo) {
      queryBuilder.andWhere('guardian.guardianshipStartDate <= :to', {
        to: filterDto.guardianshipStartDateTo,
      });
    }

    if (filterDto.guardianshipEndDateFrom) {
      queryBuilder.andWhere('guardian.guardianshipEndDate >= :from', {
        from: filterDto.guardianshipEndDateFrom,
      });
    }

    if (filterDto.guardianshipEndDateTo) {
      queryBuilder.andWhere('guardian.guardianshipEndDate <= :to', {
        to: filterDto.guardianshipEndDateTo,
      });
    }

    if (filterDto.search) {
      queryBuilder.andWhere(
        '(person.firstName LIKE :search OR person.lastName LIKE :search OR guardian.notes LIKE :search)',
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

    return await queryBuilder.getMany();
  }

  async findOne(id: number, { relations }: { relations?: string[] } = {}): Promise<Guardian> {
    const guardian = await this.guardianRepository.findOne({
      where: { id },
      relations: relations || ['person', 'families'],
    });

    if (!guardian) {
      throw new NotFoundException(`Guardian with ID ${id} not found`);
    }

    return guardian;
  }

  async update(id: number, updateGuardianDto: UpdateGuardianDto): Promise<Guardian> {
    const guardian = await this.findOne(id, { relations: ['person'] });

    if (updateGuardianDto.person) {
      guardian.person = await this.personsService.update(
        guardian.person.id,
        updateGuardianDto.person,
      );
      delete updateGuardianDto.person;
    }

    const guardianData = {
      ...guardian,
      ...updateGuardianDto,
      guardianshipStartDate:
        updateGuardianDto.guardianshipStartDate?.toISOString().split('T')[0] ||
        guardian.guardianshipStartDate,
      guardianshipEndDate:
        updateGuardianDto.guardianshipEndDate?.toISOString().split('T')[0] ||
        guardian.guardianshipEndDate,
    };

    const updatedGuardian = this.guardianRepository.create(guardianData);
    return await this.guardianRepository.save(updatedGuardian);
  }

  async remove(id: number): Promise<void> {
    const guardian = await this.findOne(id);
    await this.guardianRepository.softRemove(guardian);
  }

  async findByPersonId(personId: number): Promise<Guardian[]> {
    return await this.guardianRepository.find({
      where: { personId },
      relations: ['person', 'families'],
    });
  }
}
