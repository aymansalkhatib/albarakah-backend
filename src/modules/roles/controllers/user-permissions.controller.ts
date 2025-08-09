import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UserPermissionsService } from '../services/user-permissions.service';
import { AssignUserPermissionDto } from '../dtos/requests/assign-user-permission.dto';
import { BulkAssignUserPermissionsDto } from '../dtos/requests/bulk-assign-user-permissions.dto';
import { toDto } from '../../.././common/helpers/to-dto';
import { PermissionResponseDto } from '../dtos/responses/permission-response.dto';

@Controller('user-permissions')
export class UserPermissionsController {
  constructor(private readonly userPermissionsService: UserPermissionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async assignPermissionToUser(@Body() assignDto: AssignUserPermissionDto) {
    const userPermission = await this.userPermissionsService.assignPermissionToUser(
      assignDto.systemUserId,
      assignDto.permissionId,
      assignDto.isAllowed,
    );
    return toDto(PermissionResponseDto, userPermission.permission);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  async bulkAssignPermissions(@Body() bulkDto: BulkAssignUserPermissionsDto) {
    const userPermissions = await this.userPermissionsService.bulkAssignPermissions(
      bulkDto.systemUserId,
      bulkDto.permissions,
    );
    return toDto(
      PermissionResponseDto,
      userPermissions.map((up) => up.permission),
    );
  }

  @Get('user/:userId')
  async getUserPermissions(@Param('userId', ParseIntPipe) userId: number) {
    const userPermissions = await this.userPermissionsService.getUserPermissions(userId);
    return toDto(
      PermissionResponseDto,
      userPermissions.map((up) => up.permission),
    );
  }

  @Delete('user/:userId/permission/:permissionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeUserPermission(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('permissionId', ParseIntPipe) permissionId: number,
  ) {
    await this.userPermissionsService.removeUserPermission(userId, permissionId);
  }

  @Delete('user/:userId/all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAllUserPermissions(@Param('userId', ParseIntPipe) userId: number) {
    await this.userPermissionsService.removeAllUserPermissions(userId);
  }
}
