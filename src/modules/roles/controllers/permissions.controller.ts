import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PermissionsService } from '../services/permissions.service';
import { FilterPermissionDto } from '../dtos/queries/filter-permission.dto';
import { toDto } from '../../.././common/helpers/to-dto';
import { PermissionResponseDto } from '../dtos/responses/permission-response.dto';
import { Protected } from '@app/common/decorators/protected.decorator';
import { Permission } from '../enums/permission.enum';
import { SerializeResponse } from '@app/common/decorators/serialize-response.decorator';
import { PaginationResponseDto } from '@app/common/pagination/dto/pagination-response.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @Protected(Permission.READ_PERMISSION)
  async findAllPermissions(
    @Query() filterDto: FilterPermissionDto,
  ): Promise<PaginationResponseDto<PermissionResponseDto>> {
    return await this.permissionsService.findAllPermissions(filterDto);
  }

  @Get('user/:userId/allowed')
  @Protected(Permission.READ_PERMISSION)
  @SerializeResponse(PermissionResponseDto)
  async getAllPermissionsForUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<PermissionResponseDto[]> {
    return await this.permissionsService.getEffectiveUserPermissions(userId);
  }

  // Order specific routes before dynamic :id to avoid conflicts
  @Get(':id/role')
  @Protected(Permission.READ_PERMISSION)
  @SerializeResponse(PermissionResponseDto)
  async findPermissionRoleById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PermissionResponseDto[]> {
    return await this.permissionsService.getPermissionsForRole(id);
  }

  @Get(':id')
  @Protected(Permission.READ_PERMISSION)
  @SerializeResponse(PermissionResponseDto)
  async findPermissionById(@Param('id', ParseIntPipe) id: number): Promise<PermissionResponseDto> {
    return await this.permissionsService.findPermissionById(id);
  }
}
