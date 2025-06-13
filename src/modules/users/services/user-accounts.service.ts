import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from '../entities/user-accounts.entity';
import { CreateUserAccountDto } from '../dto/create-user-account.dto';
import { UpdateUserAccountDto } from '../dto/update-user-account.dto';

@Injectable()
export class UserAccountsService {
  constructor(
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
  ) {}

  async create(createUserAccountDto: CreateUserAccountDto): Promise<UserAccount> {
    const userAccount = this.userAccountRepository.create(createUserAccountDto);
    return this.userAccountRepository.save(userAccount);
  }

  async findAll(): Promise<UserAccount[]> {
    return this.userAccountRepository.find();
  }

  async findOne(id: number): Promise<UserAccount> {
    return this.userAccountRepository.findOneOrFail({ where: { id } });
  }

  async update(id: number, updateUserAccountDto: UpdateUserAccountDto): Promise<UserAccount> {
    await this.userAccountRepository.update(id, updateUserAccountDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.userAccountRepository.delete(id);
  }
}
