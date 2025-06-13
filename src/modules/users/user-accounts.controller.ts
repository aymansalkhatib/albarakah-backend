import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserAccountResponseDto } from './dto/user-account-response.dto';
import { CreateUserAccountDto } from './dto/create-user-account.dto';
import { UpdateUserAccountDto } from './dto/update-user-account.dto';
import { UserAccountsService } from './services/user-accounts.service';
import { toDto } from 'src/common/helpers/to-dto';

@Controller('user-accounts')
export class UserAccountsController {
  constructor(private readonly userAccountsService: UserAccountsService) {}

  @Post()
  async create(
    @Body() createUserAccountDto: CreateUserAccountDto,
  ): Promise<UserAccountResponseDto> {
    const userAccount = await this.userAccountsService.create(createUserAccountDto);
    return toDto(UserAccountResponseDto, userAccount);
  }

  @Get()
  async findAll(): Promise<UserAccountResponseDto[]> {
    const userAccounts = await this.userAccountsService.findAll();
    return toDto(UserAccountResponseDto, userAccounts);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserAccountResponseDto> {
    const userAccount = await this.userAccountsService.findOne(id);
    return toDto(UserAccountResponseDto, userAccount);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserAccountDto: UpdateUserAccountDto,
  ): Promise<UserAccountResponseDto> {
    const userAccount = await this.userAccountsService.update(id, updateUserAccountDto);
    return toDto(UserAccountResponseDto, userAccount);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    const userAccount = await this.userAccountsService.findOne(id);
    if (!userAccount) {
      throw new NotFoundException(`User account with ID ${id} not found`);
    }
    await this.userAccountsService.remove(id);
    return { message: `User account with ID ${id} has been deleted successfully` };
  }
}
