import { Employee } from '../../../modules/employees/entities/employee.entity';
import { EmployeesService } from '../../../modules/employees/services/employee.service';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';
import { applyEmployeeFilters } from '../../employees/utils/employee-filter.util';
import { applyPersonFilters } from '../../../modules/persons/utils/person-filter.util';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { FilterSystemUserDto } from '../dtos/queries/filter-system-user.dto';
import { CreateSystemUserDto } from '../dtos/requests/create-system-user.dto';
import { UpdateSystemUserDto } from '../dtos/requests/update-system-user.dto';
import { SystemUser } from '../entities/system-user.entity';
import { paginate } from '../../../common/pagination/paginate.service';
import { SystemUserResponseDto } from '../dtos/responses/system-user-response.dto';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';

@Injectable()
export class SystemUsersService {
  constructor(
    @InjectRepository(SystemUser)
    private readonly systemUserRepository: Repository<SystemUser>,
    private readonly translateHelper: TranslateHelper,
    private readonly employeesService: EmployeesService,
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
        const roleRepo = manager.getRepository('Role');
        const role = await roleRepo.findOne({
          where: { id: createUserAccountDto.roleId },
        });
        if (!role) {
          throw new NotFoundException(`Role with ID ${createUserAccountDto.roleId} not found`);
        }

        if (createUserAccountDto.employeeId) {
          employee = await this.employeesService.findOne(createUserAccountDto.employeeId, {
            relations: ['systemUser'],
          });

          if (employee.systemUser) {
            throw new ConflictException(
              this.translateHelper.tr('system-users.errors.employee_has_system_account'),
            );
          }
        } else {
          employee = await this.employeesService.create(createUserAccountDto.employee);
        }

        const systemUser = systemUserRepo.create({
          ...createUserAccountDto,
          employee: employee,
        });

        return await systemUserRepo.save(systemUser);
      },
    );

    return this.findOne(saved.id, { relations: ['employee', 'role', 'employee.person'] });
  }

  async update(id: number, updateSystemUserDto: UpdateSystemUserDto): Promise<SystemUser> {
    const systemUser = await this.findOne(id, { relations: ['employee', 'role'] });

    if (updateSystemUserDto.username) {
      const existingUser = await this.systemUserRepository.findOne({
        where: {
          id: Not(id),
          username: updateSystemUserDto.username,
        },
      });
      if (existingUser) {
        throw new ConflictException(this.translateHelper.tr('system-users.errors.username_taken'));
      }
    }

    if (updateSystemUserDto.employee) {
      systemUser.employee = await this.employeesService.update(
        systemUser.employeeId,
        updateSystemUserDto.employee,
      );
      delete updateSystemUserDto.employee;
    }

    this.systemUserRepository.merge(systemUser, updateSystemUserDto);
    return this.systemUserRepository.save(systemUser);
  }

  async delete(id: number): Promise<void> {
    const result = await this.systemUserRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(this.translateHelper.tr('system-users.errors.not_found', { id }));
    }
  }

  async findOne(id: number, { relations }: { relations?: string[] } = {}): Promise<SystemUser> {
    const systemUser = await this.systemUserRepository.findOne({
      where: { id },
      relations,
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

    // Filter by roleId (direct role ID)
    if (filterDto.roleId) {
      queryBuilder.andWhere('systemUser.roleId = :roleId', {
        roleId: filterDto.roleId,
      });
    }

    // Filter by username
    if (filterDto.username) {
      queryBuilder.andWhere('systemUser.username ILIKE :username', {
        username: `%${filterDto.username}%`,
      });
    }

    // Role filters
    if (filterDto.role) {
      if (filterDto.role.name) {
        queryBuilder.andWhere('(role.name ILIKE :name)', {
          name: `%${filterDto.role.name}%`,
        });
      }
    }

    // Employee filters
    if (filterDto.employee) {
      // Apply employee filters using utility (excluding search)
      const { search, person, ...employeeFilters } = filterDto.employee;
      applyEmployeeFilters(queryBuilder, 'employee', employeeFilters);

      // Person filters (nested under employee)
      if (filterDto.employee.person) {
        applyPersonFilters(queryBuilder, 'person', filterDto.employee.person);
      }
    }

    return paginate(queryBuilder, filterDto, SystemUserResponseDto);
  }
}
