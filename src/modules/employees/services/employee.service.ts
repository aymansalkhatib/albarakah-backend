import { Person } from '../../persons/entities/person.entity';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { paginate } from '../../../common/pagination/paginate.service';
import { PersonRelation } from '../../../modules/persons/enums/person-relation.enum';
import { PersonsService } from '../../../modules/persons/services/persons.service';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';
import { applyPersonFilters } from '../../persons/utils/person-filter.util';
import { FilterEmployeeDto } from '../dtos/queries/filter-employee.dto';
import { CreateEmployeeDto } from '../dtos/requests/create-employee.dto';
import { UpdateEmployeeDto } from '../dtos/requests/update-employee.dto';
import { EmployeeResponseDto } from '../dtos/responses/employee-response.dto';
import { Employee } from '../entities/employee.entity';
import { applyEmployeeFilters } from '../utils/employee-filter.util';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly personsService: PersonsService,
    private readonly translateHelper: TranslateHelper,
  ) {}

  async create(
    createEmployeeDto: CreateEmployeeDto,
    entityManager?: EntityManager,
  ): Promise<Employee> {
    if (entityManager) {
      // If already inside a transaction, use the provided manager
      return await this._createWithManager(createEmployeeDto, entityManager);
    } else {
      // Otherwise, start a new transaction
      return await this.employeeRepository.manager.transaction(async (manager) => {
        return await this._createWithManager(createEmployeeDto, manager);
      });
    }
  }

  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
    entityManager?: EntityManager,
  ): Promise<Employee> {
    if (entityManager) {
      // If already inside a transaction, use the provided manager
      return await this._updateWithManager(id, updateEmployeeDto, entityManager);
    } else {
      // Otherwise, start a new transaction
      return await this.employeeRepository.manager.transaction(async (manager) => {
        return await this._updateWithManager(id, updateEmployeeDto, manager);
      });
    }
  }

  async delete(id: number): Promise<void> {
    const employee = await this.findOne(id);
    await this.employeeRepository.delete(id);
    await this.personsService.deleteIf(employee.personId, PersonRelation.EMPLOYEE);
  }

  async findOne(
    id: number,
    { relations }: { relations?: string[] } = {},
    entityManager?: EntityManager,
  ): Promise<Employee> {
    const employeeRepository = entityManager
      ? entityManager.getRepository(Employee)
      : this.employeeRepository;

    const employee = await employeeRepository.findOne({
      where: { id },
      relations: relations,
    });

    if (!employee) {
      throw new NotFoundException(this.translateHelper.tr('employees.errors.not_found', { id }));
    }

    return employee;
  }

  async findAll(filterDto: FilterEmployeeDto): Promise<PaginationResponseDto<EmployeeResponseDto>> {
    const queryBuilder = this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.person', 'person');

    // Apply employee filters
    applyEmployeeFilters(queryBuilder, 'employee', filterDto);

    // Add person filters
    if (filterDto.person) {
      applyPersonFilters(queryBuilder, 'person', filterDto.person);
    }

    return paginate(queryBuilder, filterDto, EmployeeResponseDto);
  }
  //

  private async _createWithManager(
    createEmployeeDto: CreateEmployeeDto,
    entityManager: EntityManager,
  ): Promise<Employee> {
    const employeeRepository = entityManager.getRepository(Employee);

    let person: Person;

    if (createEmployeeDto.personId) {
      person = await this.personsService.findOne(
        createEmployeeDto.personId,
        { relations: ['employee'] },
        entityManager,
      );

      if (person.employee) {
        throw new ConflictException(this.translateHelper.tr('employees.errors.already_employee'));
      }
    } else {
      person = await this.personsService.create(createEmployeeDto.person, entityManager);
    }

    const employee = employeeRepository.create({
      ...createEmployeeDto,
      person,
    });

    return await employeeRepository.save(employee);
  }

  private async _updateWithManager(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
    entityManager: EntityManager,
  ): Promise<Employee> {
    const employeeRepository = entityManager.getRepository(Employee);

    const employee = await this.findOne(id, { relations: ['person'] }, entityManager);

    if (updateEmployeeDto.person) {
      employee.person = await this.personsService.update(
        employee.person.id,
        updateEmployeeDto.person,
        entityManager,
      );
      delete updateEmployeeDto.person;
    }

    employeeRepository.merge(employee, updateEmployeeDto);
    return await employeeRepository.save(employee);
  }
}
