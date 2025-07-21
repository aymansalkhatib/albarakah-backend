import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { Protected } from '@app/common/decorators/protected.decorator';
import { Permission } from '@app/modules/roles/enums/permission.enum';
import { FilterSystemUserDto } from '../dtos/queries/filter-system-user.dto';
import { CreateSystemUserDto } from '../dtos/requests/create-system-user.dto';
import { UpdateSystemUserDto } from '../dtos/requests/update-system-user.dto';
import { SystemUserResponseDto } from '../dtos/responses/system-user-response.dto';
import { SystemUsersService } from '../services/system-users.service';
import { SerializeResponse } from '@app/common/decorators/serialize-response.decorator';
import { CurrentUser } from '@app/common/guards/current-user.decorator';
import { SystemUser } from '../entities/system-user.entity';
import { PaginationResponseDto } from '@app/common/pagination/dto/pagination-response.dto';

@Controller('system-users')
export class SystemUsersController {
  constructor(private readonly systemUsersService: SystemUsersService) {}

  @Post()
  @SerializeResponse(SystemUserResponseDto)
  @Protected(Permission.CREATE_SYSTEM_USER)
  async create(@Body() createUserAccountDto: CreateSystemUserDto): Promise<SystemUserResponseDto> {
    return await this.systemUsersService.create(createUserAccountDto);
  }

  @Patch(':id')
  @SerializeResponse(SystemUserResponseDto)
  @Protected()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserAccountDto: UpdateSystemUserDto,
  ): Promise<SystemUserResponseDto> {
    return await this.systemUsersService.update(id, updateUserAccountDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.systemUsersService.delete(id);
  }

  @Get('me')
  @SerializeResponse(SystemUserResponseDto)
  async getCurrentUser(@CurrentUser() systemUser: SystemUser): Promise<SystemUserResponseDto> {
    return systemUser;
  }

  @Get(':id')
  @SerializeResponse(SystemUserResponseDto)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<SystemUserResponseDto> {
    const systemUser = await this.systemUsersService.findOne(id, {
      relations: ['employee', 'role', 'employee.person'],
    });
    return systemUser;
  }

  @Get()
  async findAll(
    @Query() filterDto: FilterSystemUserDto,
  ): Promise<PaginationResponseDto<SystemUserResponseDto>> {
    return await this.systemUsersService.findAll(filterDto);
  }
}
