import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PersonsService } from '../persons/persons.service';
import { FilterEmployeeDto } from './dto/filter-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly personsService: PersonsService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    ///
    //- Validate person existence and check for existing employee association
    if (createEmployeeDto.personId) {
      const person = await this.personsService.findOne(createEmployeeDto.personId, {
        relations: ['employee'],
      });
      if (person.employee) {
        throw new ConflictException(
          `Person with ID ${createEmployeeDto.personId} is already an employee`,
        );
      }
    }
    ///
    //- Validate that the national ID is unique if provided in the new person data
    else if (createEmployeeDto.person) {
      await this.personsService.checkPersonExists(createEmployeeDto.person);
    }

    const employee = this.employeeRepository.create(createEmployeeDto);
    return await this.employeeRepository.save(employee);
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);

    if (updateEmployeeDto.person) {
      // Filter out unchanged fields from the person update to avoid unnecessary duplicate checks
      const cleanPersonDto = this.personsService.filterChangedPersonData(
        employee.person,
        updateEmployeeDto.person,
      );

      // Only check if there are actual changes
      if (Object.keys(cleanPersonDto).length > 0) {
        await this.personsService.checkPersonExists(cleanPersonDto);
      }
    }

    const mergedEmployee = this.employeeRepository.merge(employee, updateEmployeeDto);
    return await this.employeeRepository.save(mergedEmployee);
  }

  async delete(id: number): Promise<{ message: string }> {
    const employee = await this.findOne(id);
    await this.employeeRepository.delete(id);
    return {
      message: `Employee ${employee.person?.firstName} ${employee.person?.lastName} has been deleted`,
    };
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['person'],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
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
      }
    }

    return await queryBuilder.getMany();
  }
}
