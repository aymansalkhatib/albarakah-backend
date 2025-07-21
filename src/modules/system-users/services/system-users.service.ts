import { Employee } from '@app/modules/employees/entities/employee.entity';
import { EmployeesService } from '@app/modules/employees/services/employee.service';
import { TranslateHelper } from '@app/shared/modules/app-i18n/translate.helper';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { FilterSystemUserDto } from '../dtos/queries/filter-system-user.dto';
import { CreateSystemUserDto } from '../dtos/requests/create-system-user.dto';
import { UpdateSystemUserDto } from '../dtos/requests/update-system-user.dto';
import { SystemUser } from '../entities/system-user.entity';
import { paginate } from '@app/common/pagination/paginate.service';
import { SystemUserResponseDto } from '../dtos/responses/system-user-response.dto';
import { PaginationResponseDto } from '@app/common/pagination/dto/pagination-response.dto';

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

    const existingUser = await this.systemUserRepository.exists({
      where: { username: createUserAccountDto.username },
    });

    if (existingUser) {
      throw new ConflictException(this.translateHelper.tr('system-users.errors.username_taken'));
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

    const systemUser = this.systemUserRepository.create({ ...createUserAccountDto, employee });
    const saved = await this.systemUserRepository.save(systemUser);
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

  async findAll(filterDto: FilterSystemUserDto): Promise<PaginationResponseDto<SystemUserResponseDto>> {
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
      if (filterDto.role.id) {
        queryBuilder.andWhere('role.id = :roleId', {
          roleId: filterDto.role.id,
        });
      }

      if (filterDto.role.name) {
        queryBuilder.andWhere('(role.name ILIKE :name)', {
          name: `%${filterDto.role.name}%`,
        });
      }
    }

    // Employee filters
    if (filterDto.employee) {
      if (filterDto.employee.position) {
        queryBuilder.andWhere('employee.position ILIKE :position', {
          position: `%${filterDto.employee.position}%`,
        });
      }

      if (filterDto.employee.hireDateFrom) {
        queryBuilder.andWhere('employee.hireDate >= :hireDateFrom', {
          hireDateFrom: filterDto.employee.hireDateFrom,
        });
      }

      if (filterDto.employee.hireDateTo) {
        queryBuilder.andWhere('employee.hireDate <= :hireDateTo', {
          hireDateTo: filterDto.employee.hireDateTo,
        });
      }

      if (filterDto.employee.terminationDateFrom) {
        queryBuilder.andWhere('employee.terminationDate >= :terminationDateFrom', {
          terminationDateFrom: filterDto.employee.terminationDateFrom,
        });
      }

      if (filterDto.employee.terminationDateTo) {
        queryBuilder.andWhere('employee.terminationDate <= :terminationDateTo', {
          terminationDateTo: filterDto.employee.terminationDateTo,
        });
      }

      if (filterDto.employee.search) {
        queryBuilder.andWhere(
          '(person.firstName ILIKE :employeeSearch OR person.lastName ILIKE :employeeSearch OR employee.position ILIKE :employeeSearch)',
          { employeeSearch: `%${filterDto.employee.search}%` },
        );
      }

      // Person filters (nested under employee)
      if (filterDto.employee.person) {
        if (filterDto.employee.person.firstName) {
          queryBuilder.andWhere('person.firstName ILIKE :firstName', {
            firstName: `%${filterDto.employee.person.firstName}%`,
          });
        }

        if (filterDto.employee.person.lastName) {
          queryBuilder.andWhere('person.lastName ILIKE :lastName', {
            lastName: `%${filterDto.employee.person.lastName}%`,
          });
        }

        if (filterDto.employee.person.nationalId) {
          queryBuilder.andWhere('person.nationalId ILIKE :nationalId', {
            nationalId: `%${filterDto.employee.person.nationalId}%`,
          });
        }

        if (filterDto.employee.person.isPalestinian !== undefined) {
          queryBuilder.andWhere('person.isPalestinian = :isPalestinian', {
            isPalestinian: filterDto.employee.person.isPalestinian,
          });
        }

        if (filterDto.employee.person.gender) {
          queryBuilder.andWhere('person.gender = :gender', {
            gender: filterDto.employee.person.gender,
          });
        }

        if (filterDto.employee.person.nationality) {
          queryBuilder.andWhere('person.nationality ILIKE :nationality', {
            nationality: `%${filterDto.employee.person.nationality}%`,
          });
        }

        if (filterDto.employee.person.phone) {
          queryBuilder.andWhere('person.phone ILIKE :phone', {
            phone: `%${filterDto.employee.person.phone}%`,
          });
        }

        if (filterDto.employee.person.email) {
          queryBuilder.andWhere('person.email ILIKE :email', {
            email: `%${filterDto.employee.person.email}%`,
          });
        }

        // Birth date range filter
        if (filterDto.employee.person.birthDateFrom && filterDto.employee.person.birthDateTo) {
          queryBuilder.andWhere('person.birthDate BETWEEN :birthDateFrom AND :birthDateTo', {
            birthDateFrom: filterDto.employee.person.birthDateFrom,
            birthDateTo: filterDto.employee.person.birthDateTo,
          });
        } else if (filterDto.employee.person.birthDateFrom) {
          queryBuilder.andWhere('person.birthDate >= :birthDateFrom', {
            birthDateFrom: filterDto.employee.person.birthDateFrom,
          });
        } else if (filterDto.employee.person.birthDateTo) {
          queryBuilder.andWhere('person.birthDate <= :birthDateTo', {
            birthDateTo: filterDto.employee.person.birthDateTo,
          });
        }
      }
    }

    queryBuilder.orderBy('systemUser.createdAt', 'DESC');

    return paginate(queryBuilder, filterDto, SystemUserResponseDto);
  }
}
