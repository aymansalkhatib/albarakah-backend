import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from '../entities/user-accounts.entity';
import { CreateUserAccountDto } from '../dto/create-user-account.dto';
import { UpdateUserAccountDto } from '../dto/update-user-account.dto';
import * as bcrypt from 'bcrypt';
import { EmployeesService } from '../../employees/services/employees.service';

@Injectable()
export class UserAccountsService {
  constructor(
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
    private readonly employeesService: EmployeesService,
  ) {}

  async create(createUserAccountDto: CreateUserAccountDto): Promise<UserAccount> {
    const hashedPassword = await bcrypt.hash(createUserAccountDto.password, 10);

    let employeesId = createUserAccountDto.employeesId;

    // If employee DTO is provided, create the employee first
    if (createUserAccountDto.employee) {
      const employee = await this.employeesService.create(createUserAccountDto.employee);
      employeesId = employee.id;
    }

    const userAccount = this.userAccountRepository.create({
      ...createUserAccountDto,
      password: hashedPassword,
      employeesId,
    });

    return this.userAccountRepository.save(userAccount);
  }

  async findAll(): Promise<UserAccount[]> {
    return this.userAccountRepository.find();
  }

  async findOne(id: number): Promise<UserAccount> {
    const userAccount = await this.userAccountRepository.findOne({ where: { id } });
    if (!userAccount) {
      throw new NotFoundException(`User account with ID ${id} not found`);
    }
    return userAccount;
  }

  async update(id: number, updateUserAccountDto: UpdateUserAccountDto): Promise<UserAccount> {
    const userAccount = await this.findOne(id);

    if (updateUserAccountDto.password) {
      updateUserAccountDto.password = await bcrypt.hash(updateUserAccountDto.password, 10);
    }

    // If employee DTO is provided, update the employee
    if (updateUserAccountDto.employee && userAccount.employeesId) {
      await this.employeesService.update(userAccount.employeesId, updateUserAccountDto.employee);
    }

    // Remove employee from the DTO before updating user account
    const { employee, ...userAccountData } = updateUserAccountDto;
    Object.assign(userAccount, userAccountData);

    return this.userAccountRepository.save(userAccount);
  }

  async remove(id: number): Promise<void> {
    const userAccount = await this.findOne(id);
    await this.userAccountRepository.softRemove(userAccount);
  }

  async findByUsername(username: string): Promise<UserAccount | null> {
    return this.userAccountRepository.findOne({ where: { username } });
  }
}
