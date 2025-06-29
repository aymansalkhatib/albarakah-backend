import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { PermissionsService } from '../services/permissions.service';
import { FilterPermissionDto } from '../dtos/queries/filter-permission.dto';
import { toDto } from '@app/common/helpers/to-dto';
import { PermissionResponseDto } from '../dtos/responses/permission-response.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  async findAllPermissions(@Query() filterDto: FilterPermissionDto) {
    const permissions = await this.permissionsService.findAllPermissions(filterDto);
    return permissions;
  }

  @Get(':id')
  async findPermissionById(@Param('id', ParseIntPipe) id: number) {
    const permission = await this.permissionsService.findPermissionById(id);
    return toDto(PermissionResponseDto, permission);
  }

  @Get(':id/role')
  async findPermissionRoleById(@Param('id', ParseIntPipe) id: number) {
    const permissionRole = await this.permissionsService.getPermissionsForRole(id);
    return toDto(PermissionResponseDto, permissionRole);
  }

  @Get('user/:userId/allowed')
  async getAllPermissionsForUser(@Param('userId', ParseIntPipe) userId: number) {
    const permissions = await this.permissionsService.getAllAllowedPermissionsForUser(userId);
    return toDto(PermissionResponseDto, permissions);
  }
}
