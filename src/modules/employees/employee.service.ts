import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PersonsService } from '../persons/persons.service';

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
      const person = await this.personsService.findOne(createEmployeeDto.personId, ['employee']);
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

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['person', 'userAccount', 'interviews'],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);

    // If updating person data, check for unique constraints
    if (updateEmployeeDto.person) {
      const { nationalId, email, firstName, lastName, birthDate } = updateEmployeeDto.person;

      // Check if nationalId is provided and unique
      //   if (nationalId) {
      //     const existingPersonWithNationalId = await this.personRepository.findOneBy({ nationalId });
      //     if (existingPersonWithNationalId && existingPersonWithNationalId.id !== employee.personId) {
      //       throw new ConflictException(`Person with National ID ${nationalId} already exists`);
      //     }
      //   }

      //   // Check if email is provided and unique
      //   if (email) {
      //     const existingPersonWithEmail = await this.personRepository.findOneBy({ email });
      //     if (existingPersonWithEmail && existingPersonWithEmail.id !== employee.personId) {
      //       throw new ConflictException(`Person with email ${email} already exists`);
      //     }
      //   }

      //   // Validate required fields
      //   if (!firstName || !lastName || !birthDate) {
      //     const existingPerson = await this.personRepository.findOne({
      //       where: [{ firstName, lastName, birthDate }],
      //     });
      //     if (existingPerson && existingPerson.id !== employee.personId) {
      //       throw new ConflictException(
      //         'A person with this first name, last name, and birth date or national ID already exists',
      //       );
      //     }
      //   }
    }

    const mergedEmployee = this.employeeRepository.merge(employee, updateEmployeeDto);
    return await this.employeeRepository.save(mergedEmployee);
  }

  async remove(id: number): Promise<{ message: string }> {
    const employee = await this.findOne(id);
    await this.employeeRepository.softDelete(id);

    return {
      message: `Employee ${employee.person?.firstName} ${employee.person?.lastName} has been deleted`,
    };
  }
}
