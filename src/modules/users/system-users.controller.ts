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
import { UpdateUserAccountDto } from './dto/update-user-account.dto';
import { toDto } from 'src/common/helpers/to-dto';
import { SystemUserResponseDto } from './dto/system-user-response.dto';
import { CreateSystemUserDto } from './dto/create-system-user.dto';
import { SystemUsersService } from './system-users.service';

@Controller('system-users')
export class SystemUsersController {
  constructor(private readonly systemUsersService: SystemUsersService) {}

  @Post()
  async create(@Body() createUserAccountDto: CreateSystemUserDto): Promise<SystemUserResponseDto> {
    const systemUser = await this.systemUsersService.create(createUserAccountDto);
    return toDto(SystemUserResponseDto, systemUser);
  }

  @Get()
  async findAll(): Promise<SystemUserResponseDto[]> {
    const systemUsers = await this.systemUsersService.findAll();
    return toDto(SystemUserResponseDto, systemUsers);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<SystemUserResponseDto> {
    const systemUser = await this.systemUsersService.findOne(id);
    return toDto(SystemUserResponseDto, systemUser);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserAccountDto: UpdateUserAccountDto,
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
}
