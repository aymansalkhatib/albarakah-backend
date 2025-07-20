import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TranslateHelper } from '@app/shared/modules/app-i18n/translate.helper';
import { Person } from '@app/modules/persons/entities/person.entity';
import { PersonsService } from '@app/modules/persons/services/persons.service';
import { FilterEmployeeDto } from '../dtos/queries/filter-employee.dto';
import { CreateEmployeeDto } from '../dtos/requests/create-employee.dto';
import { UpdateEmployeeDto } from '../dtos/requests/update-employee.dto';
import { Employee } from '../entities/employee.entity';
import { PersonRelation } from '@app/modules/persons/enums/person-relation.enum';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly personsService: PersonsService,
    private readonly translateHelper: TranslateHelper,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    let person: Person;

    if (createEmployeeDto.personId) {
      person = await this.personsService.findOne(createEmployeeDto.personId, {
        relations: ['employee'],
      });

      if (person.employee) {
        throw new ConflictException(this.translateHelper.tr('employees.errors.already_employee'));
      }
    } else {
      person = await this.personsService.create(createEmployeeDto.person);
    }
    const employee = this.employeeRepository.create({
      ...createEmployeeDto,
      person,
    });
    return await this.employeeRepository.save(employee);
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id, { relations: ['person'] });

    if (updateEmployeeDto.person) {
      employee.person = await this.personsService.update(
        employee.person.id,
        updateEmployeeDto.person,
      );
      delete updateEmployeeDto.person;
    }

    const updatedEmployee = this.employeeRepository.merge(employee, updateEmployeeDto);
    return await this.employeeRepository.save(updatedEmployee);
  }

  async delete(id: number): Promise<void> {
    const employee = await this.findOne(id, { relations: ['systemUser'] });
    await this.employeeRepository.delete(id);
    await this.personsService.deleteIf(employee.personId, PersonRelation.EMPLOYEE);
  }

  async findOne(id: number, { relations }: { relations?: string[] } = {}): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: relations || [],
    });

    if (!employee) {
      throw new NotFoundException(this.translateHelper.tr('employees.errors.not_found', { id }));
    }

    return employee;
  }

  async findAll(filterDto: FilterEmployeeDto): Promise<Employee[]> {
    const queryBuilder = this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.person', 'person');

    if (filterDto.position) {
      queryBuilder.andWhere('employee.position LIKE :position', {
        position: `%${filterDto.position}%`,
      });
    }

    if (filterDto.hireDateFrom && filterDto.hireDateTo) {
      queryBuilder.andWhere('employee.hireDate BETWEEN :hireDateFrom AND :hireDateTo', {
        hireDateFrom: filterDto.hireDateFrom,
        hireDateTo: filterDto.hireDateTo,
      });
    } else if (filterDto.hireDateFrom) {
      queryBuilder.andWhere('employee.hireDate >= :hireDateFrom', {
        hireDateFrom: filterDto.hireDateFrom,
      });
    } else if (filterDto.hireDateTo) {
      queryBuilder.andWhere('employee.hireDate <= :hireDateTo', {
        hireDateTo: filterDto.hireDateTo,
      });
    }

    if (filterDto.terminationDateFrom && filterDto.terminationDateTo) {
      queryBuilder.andWhere(
        'employee.terminationDate BETWEEN :terminationDateFrom AND :terminationDateTo',
        {
          terminationDateFrom: filterDto.terminationDateFrom,
          terminationDateTo: filterDto.terminationDateTo,
        },
      );
    } else if (filterDto.terminationDateFrom) {
      queryBuilder.andWhere('employee.terminationDate >= :terminationDateFrom', {
        terminationDateFrom: filterDto.terminationDateFrom,
      });
    } else if (filterDto.terminationDateTo) {
      queryBuilder.andWhere('employee.terminationDate <= :terminationDateTo', {
        terminationDateTo: filterDto.terminationDateTo,
      });
    }

    if (filterDto.search) {
      queryBuilder.andWhere(
        `(
          person.firstName LIKE :search OR
          person.lastName LIKE :search OR
          employee.position LIKE :search OR
          COALESCE(person.notes, '') LIKE :search OR
          COALESCE(employee.notes, '') LIKE :search
        )`,
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
}
