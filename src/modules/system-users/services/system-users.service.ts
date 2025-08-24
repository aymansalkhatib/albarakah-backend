import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOneOptions, Not, Repository } from 'typeorm';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { paginate } from '../../../common/pagination/paginate.service';
import { Employee } from '../../../modules/employees/entities/employee.entity';
import { EmployeesService } from '../../../modules/employees/services/employee.service';
import { applyPersonFilters } from '../../../modules/persons/utils/person-filter.util';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';
import { applyEmployeeFilters } from '../../employees/utils/employee-filter.util';
import { RolesService } from '../../roles/services/roles.service';
import { FilterSystemUserDto } from '../dtos/queries/filter-system-user.dto';
import { CreateSystemUserDto } from '../dtos/requests/create-system-user.dto';
import { UpdateSystemUserDto } from '../dtos/requests/update-system-user.dto';
import { SystemUserResponseDto } from '../dtos/responses/system-user-response.dto';
import { SystemUser } from '../entities/system-user.entity';
import { applySystemUserFilters } from '../utils/system-user-filter.util';

@Injectable()
export class SystemUsersService {
  constructor(
    @InjectRepository(SystemUser)
    private readonly systemUserRepository: Repository<SystemUser>,
    private readonly translateHelper: TranslateHelper,
    private readonly employeesService: EmployeesService,
    private readonly rolesService: RolesService,
  ) {}

  async create(createUserAccountDto: CreateSystemUserDto): Promise<SystemUser> {
    let employee: Employee;

    const saved: SystemUser = await this.systemUserRepository.manager.transaction(
      async (manager) => {
        const systemUserRepo = manager.getRepository(SystemUser);

        const existingUser = await systemUserRepo.exists({
          where: { username: createUserAccountDto.username },
        });

        if (existingUser) {
          throw new ConflictException(
            this.translateHelper.tr('system-users.errors.username_taken'),
          );
        }

        // Check if role exists

        await this.rolesService.findOne(createUserAccountDto.roleId, {}, manager);

        if (createUserAccountDto.employeeId) {
          employee = await this.employeesService.findOne(
            createUserAccountDto.employeeId,
            {
              relations: ['systemUser'],
            },
            manager,
          );

          if (employee.systemUser) {
            throw new ConflictException(
              this.translateHelper.tr('system-users.errors.employee_has_system_account'),
            );
          }
        } else {
          employee = await this.employeesService.create(createUserAccountDto.employee, manager);
        }

        const systemUser = systemUserRepo.create({
          ...createUserAccountDto,
          employee: employee,
        });

        return await systemUserRepo.save(systemUser);
      },
    );

    return this.findOne(saved.id, {
      relations: ['employee', 'role', 'employee.person'],
    });
  }

  async update(id: number, updateSystemUserDto: UpdateSystemUserDto): Promise<SystemUser> {
    return await this.systemUserRepository.manager.transaction(async (manager) => {
      const systemUserRepo = manager.getRepository(SystemUser);

      const systemUser = await this.findOne(
        id,
        {
          relations: ['employee', 'role'],
        },
        manager,
      );

      if (!systemUser) {
        throw new NotFoundException(
          this.translateHelper.tr('system-users.errors.not_found', { id }),
        );
      }

      if (updateSystemUserDto.username) {
        const existingUser = await systemUserRepo.findOne({
          where: {
            id: Not(id),
            username: updateSystemUserDto.username,
          },
        });
        if (existingUser) {
          throw new ConflictException(
            this.translateHelper.tr('system-users.errors.username_taken'),
          );
        }
      }

      if (updateSystemUserDto.employee) {
        // Use the employeesService with the transaction manager
        systemUser.employee = await this.employeesService.update(
          systemUser.employeeId,
          updateSystemUserDto.employee,
          manager,
        );
        delete updateSystemUserDto.employee;
      }

      systemUserRepo.merge(systemUser, updateSystemUserDto);
      const saved = await systemUserRepo.save(systemUser);

      // Optionally reload with relations

      return this.findOne(saved.id, {
        relations: ['employee', 'role', 'employee.person'],
      });
    });
  }

  async delete(id: number): Promise<void> {
    const result = await this.systemUserRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(this.translateHelper.tr('system-users.errors.not_found', { id }));
    }
  }

  async findOne(
    id: number,
    options: FindOneOptions<SystemUser> = {},
    manager?: EntityManager,
  ): Promise<SystemUser> {
    const systemUserRepository = manager
      ? manager.getRepository(SystemUser)
      : this.systemUserRepository;

    const systemUser = await systemUserRepository.findOne({
      where: { id },
      ...options,
    });

    if (!systemUser) {
      throw new NotFoundException(this.translateHelper.tr('system-users.errors.not_found', { id }));
    }

    return systemUser;
  }

  async findAll(
    filterDto: FilterSystemUserDto,
  ): Promise<PaginationResponseDto<SystemUserResponseDto>> {
    const queryBuilder = this.systemUserRepository
      .createQueryBuilder('systemUser')
      .leftJoinAndSelect('systemUser.employee', 'employee')
      .leftJoinAndSelect('employee.person', 'person')
      .leftJoinAndSelect('systemUser.role', 'role');

    // Apply system user filters
    applySystemUserFilters(queryBuilder, 'systemUser', filterDto);

    // Employee filters
    if (filterDto.employee) {
      // Apply employee filters using utility (excluding search)
      applyEmployeeFilters(queryBuilder, 'employee', filterDto.employee);

      // Person filters (nested under employee)
      if (filterDto.employee.person) {
        applyPersonFilters(queryBuilder, 'person', filterDto.employee.person);
      }
    }

    return paginate(queryBuilder, filterDto, SystemUserResponseDto);
  }
}
