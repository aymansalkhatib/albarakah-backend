import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeesService } from '../employees/employee.service';
import { Employee } from '../employees/entities/employee.entity';
import { UpdateUserAccountDto } from './dto/update-user-account.dto';
import { SystemUser } from './entities/system-user.entity';
import { CreateSystemUserDto } from './dto/create-system-user.dto';

@Injectable()
export class SystemUsersService {
  constructor(
    private readonly employeesService: EmployeesService,
    @InjectRepository(SystemUser)
    private readonly systemUserRepository: Repository<SystemUser>,
  ) {}

  async create(createUserAccountDto: CreateSystemUserDto): Promise<SystemUser> {
    let employee: Employee;

    const existingUser = await this.systemUserRepository.findOne({
      where: { username: createUserAccountDto.username },
    });

    if (existingUser) {
      throw new ConflictException('Username is already taken');
    }

    if (createUserAccountDto.employeeId) {
      employee = await this.employeesService.findOne(createUserAccountDto.employeeId, {
        relations: ['systemUser'],
      });

      if (employee.systemUser) {
        throw new ConflictException('This employee already has a system user account');
      }
    } else {
      employee = await this.employeesService.create(createUserAccountDto.employee);
    }

    const systemUser = this.systemUserRepository.create({ ...createUserAccountDto, employee });

    return this.systemUserRepository.save(systemUser);
  }

  async findAll(): Promise<SystemUser[]> {
    return this.systemUserRepository.find({
      relations: ['employee', 'role'],
    });
  }

  async findOne(id: number): Promise<SystemUser> {
    return this.systemUserRepository.findOneOrFail({
      where: { id },
      relations: ['employee', 'role'],
    });
  }

  async update(id: number, updateUserAccountDto: UpdateUserAccountDto): Promise<SystemUser> {
    const systemUser = await this.findOne(id);

    if (updateUserAccountDto.employee) {
      if (systemUser.employee) {
        const existingEmployee = await this.employeesService.findOne(systemUser.employee.id, {
          relations: ['systemUser'],
        });

        if (existingEmployee.systemUser && existingEmployee.systemUser.id !== id) {
          throw new ConflictException('This employee already has a system user account');
        }
      }
    }

    await this.systemUserRepository.update(id, updateUserAccountDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.systemUserRepository.delete(id);
  }
}
