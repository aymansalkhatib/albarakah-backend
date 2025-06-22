import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UpdateSystemUserDto } from './dto/update-user-account.dto';
import { toDto } from 'src/common/helpers/to-dto';
import { SystemUserResponseDto } from './dto/system-user-response.dto';
import { CreateSystemUserDto } from './dto/create-system-user.dto';
import { SystemUsersService } from './system-users.service';
import { FilterSystemUserDto } from './dto/filter-system-user.dto';
import 'reflect-metadata';

@Controller('system-users')
export class SystemUsersController {
  constructor(private readonly systemUsersService: SystemUsersService) {}

  @Post()
  async create(@Body() createUserAccountDto: CreateSystemUserDto): Promise<SystemUserResponseDto> {
    const systemUser = await this.systemUsersService.create(createUserAccountDto);
    return toDto(SystemUserResponseDto, systemUser);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserAccountDto: UpdateSystemUserDto,
  ): Promise<SystemUserResponseDto> {
    const systemUser = await this.systemUsersService.update(id, updateUserAccountDto);
    return toDto(SystemUserResponseDto, systemUser);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    const systemUser = await this.systemUsersService.findOne(id);
    if (!systemUser) {
      throw new NotFoundException(`System user with ID ${id} not found`);
    }
    await this.systemUsersService.remove(id);
    return { message: `System user with ID ${id} has been deleted successfully` };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<SystemUserResponseDto> {
    const systemUser = await this.systemUsersService.findOne(id, {
      relations: ['employee', 'role', 'employee.person'],
    });
    return toDto(SystemUserResponseDto, systemUser);
  }

  @Get()
  async findAll(@Query() filterDto: FilterSystemUserDto): Promise<SystemUserResponseDto[]> {
    const systemUsers = await this.systemUsersService.findAll(filterDto);
    return toDto(SystemUserResponseDto, systemUsers);
  }
}
