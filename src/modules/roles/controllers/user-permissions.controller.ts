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
import { UserPermissionResponseDto } from '../dtos/responses/user-permission-response.dto';
import { Protected } from '@app/common/decorators/protected.decorator';
import { Permission } from '../enums/permission.enum';
import { SerializeResponse } from '@app/common/decorators/serialize-response.decorator';

@Controller('user-permissions')
export class UserPermissionsController {
  constructor(private readonly userPermissionsService: UserPermissionsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Protected(Permission.CREATE_USER_PERMISSION)
  @SerializeResponse(UserPermissionResponseDto)
  assignPermissionToUser(
    @Body() assignDto: AssignUserPermissionDto,
  ): Promise<UserPermissionResponseDto> {
    return this.userPermissionsService.assignPermissionToUser(assignDto);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.OK)
  @Protected(Permission.CREATE_USER_PERMISSION)
  @SerializeResponse(UserPermissionResponseDto)
  bulkAssignPermissions(
    @Body() bulkDto: BulkAssignUserPermissionsDto,
  ): Promise<UserPermissionResponseDto[]> {
    return this.userPermissionsService.bulkAssignUserPermissions(
      bulkDto.systemUserId,
      bulkDto.permissions,
    );
  }

  @Get('user/:userId')
  @Protected(Permission.READ_USER_PERMISSION)
  @SerializeResponse(UserPermissionResponseDto)
  getUserPermissions(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<UserPermissionResponseDto[]> {
    return this.userPermissionsService.getUserPermissions(userId);
  }

  @Delete('user/:userId/permission/:permissionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Protected(Permission.DELETE_USER_PERMISSION)
  removeUserPermission(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('permissionId', ParseIntPipe) permissionId: number,
  ) {
    return this.userPermissionsService.removeUserPermission(userId, permissionId);
  }

  @Delete('user/:userId/all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Protected(Permission.DELETE_USER_PERMISSION)
  async removeAllUserPermissions(@Param('userId', ParseIntPipe) userId: number) {
    return await this.userPermissionsService.removeAllUserPermissions(userId);
  }
}
