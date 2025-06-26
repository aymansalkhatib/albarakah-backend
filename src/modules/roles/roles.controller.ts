import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from '@app/modules/roles/dtos/requests/create-role.dto';
import { UpdateRoleDto } from '@app/modules/roles/dtos/requests/update-role.dto';
import { FilterRoleDto } from '@app/modules/roles/dtos/queries/filter-role.dto';
import { CreatePermissionDto } from '@app/modules/roles/dtos/requests/create-permission.dto';
import { UpdatePermissionDto } from '@app/modules/roles/dtos/requests/update-permission.dto';
import { FilterPermissionDto } from '@app/modules/roles/dtos/queries/filter-permission.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll(@Query() filterDto: FilterRoleDto) {
    return this.rolesService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(id);
  }

  // Permission endpoints
  @Post('permissions')
  createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return this.rolesService.createPermission(createPermissionDto);
  }

  @Get('permissions')
  findAllPermissions(@Query() filterDto: FilterPermissionDto) {
    return this.rolesService.findAllPermissions(filterDto);
  }

  @Get('permissions/:id')
  findPermissionById(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findPermissionById(id);
  }

  @Patch('permissions/:id')
  updatePermission(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.rolesService.updatePermission(id, updatePermissionDto);
  }

  @Delete('permissions/:id')
  removePermission(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.removePermission(id);
  }
}
