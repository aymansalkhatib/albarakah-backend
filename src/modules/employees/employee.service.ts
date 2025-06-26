import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PersonsService } from '../persons/services/persons.service';
import { FilterEmployeeDto } from './dto/filter-employee.dto';
import { Person } from '../persons/entities/person.entity';
import { TranslateHelper } from '@app/shared/modules/app-i18n/translate.helper';

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

    const updatedEmployee = this.employeeRepository.create({
      ...employee,
      ...updateEmployeeDto,
    });

    return await this.employeeRepository.save(updatedEmployee);
  }

  async delete(id: number): Promise<{ message: string }> {
    const employee = await this.findOne(id, { relations: ['systemUser'] });
    if (employee.systemUser) {
      throw new ConflictException(
        this.translateHelper.tr('employees.errors.cannot_delete_with_system_account'),
      );
    }
    await this.employeeRepository.delete(id);
    return {
      message: this.translateHelper.tr('employees.success.deleted', {
        firstName: employee.person?.firstName,
        lastName: employee.person?.lastName,
      }),
    };
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

    if (filterDto.hireDateFrom) {
      queryBuilder.andWhere('employee.hireDate >= :from', {
        from: filterDto.hireDateFrom,
      });
    }

    if (filterDto.hireDateTo) {
      queryBuilder.andWhere('employee.hireDate <= :to', {
        to: filterDto.hireDateTo,
      });
    }

    if (filterDto.search) {
      queryBuilder.andWhere(
        '(person.firstName LIKE :search OR person.lastName LIKE :search OR employee.position LIKE :search)',
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
