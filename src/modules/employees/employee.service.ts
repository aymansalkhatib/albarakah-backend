import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Person } from '../persons/entities/person.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    if (createEmployeeDto.nationalId) {
      if (await this.personRepository.findOneBy({ nationalId: createEmployeeDto.nationalId })) {
        throw new ConflictException('National ID already exists');
      }
    }

    const person = this.personRepository.create({
      ...createEmployeeDto,
    });
    const employee = this.employeeRepository.create({
      ...createEmployeeDto,
      person: person,
    });

    const savedEmployee = await this.employeeRepository.save(employee);

    return this.findOne(savedEmployee.id);
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

    // If updating personId, check for conflicts
    // if (updateEmployeeDto.personId && updateEmployeeDto.personId !== employee.personId) {
    //   const existingEmployee = await this.employeeRepository.findOne({
    //     where: { personId: updateEmployeeDto.personId },
    //     withDeleted: false,
    //   });
    //
    //   if (existingEmployee && existingEmployee.id !== id) {
    //     throw new ConflictException(
    //       `Person with ID ${updateEmployeeDto.personId} is already an employee`,
    //     );
    //   }
    // }

    await this.employeeRepository.update(id, updateEmployeeDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const employee = await this.findOne(id);
    await this.employeeRepository.softDelete(id);

    return {
      message: `Employee ${employee.person?.firstName} ${employee.person?.lastName} has been deleted`,
    };
  }
}
