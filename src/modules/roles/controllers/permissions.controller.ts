import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PermissionsService } from '../services/permissions.service';
import { FilterPermissionDto } from '../dtos/queries/filter-permission.dto';
import { toDto } from '../../.././common/helpers/to-dto';
import { PermissionResponseDto } from '../dtos/responses/permission-response.dto';
import { Protected } from '@app/common/decorators/protected.decorator';
import { Permission } from '../enums/permission.enum';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @Protected(Permission.READ_PERMISSION)
  async findAllPermissions(@Query() filterDto: FilterPermissionDto) {
    const permissions = await this.permissionsService.findAllPermissions(filterDto);
    return permissions;
  }

  @Get('user/:userId/allowed')
  @Protected(Permission.READ_PERMISSION)
  async getAllPermissionsForUser(@Param('userId', ParseIntPipe) userId: number) {
    const permissions = await this.permissionsService.getEffectiveUserPermissions(userId);
    return toDto(PermissionResponseDto, permissions);
  }

  // Order specific routes before dynamic :id to avoid conflicts
  @Get(':id/role')
  @Protected(Permission.READ_PERMISSION)
  async findPermissionRoleById(@Param('id', ParseIntPipe) id: number) {
    const permissionRole = await this.permissionsService.getPermissionsForRole(id);
    return toDto(PermissionResponseDto, permissionRole);
  }

  @Get(':id')
  @Protected(Permission.READ_PERMISSION)
  async findPermissionById(@Param('id', ParseIntPipe) id: number) {
    const permission = await this.permissionsService.findPermissionById(id);
    return toDto(PermissionResponseDto, permission);
  }
}
