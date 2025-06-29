import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionEntity } from '../entities/permissions.entity';
import { FilterPermissionDto } from '../dtos/queries/filter-permission.dto';
import { Permission } from '../enums/permission.enum';
import { SystemUser } from '@app/modules/system-users/entities/system-user.entity';
import { UserPermissionsService } from './user-permissions.service';
import { paginate } from '@app/common/pagination/paginate.service';
import { PaginationResponseDto } from '@app/common/pagination/dto/pagination-response.dto';
import { PermissionResponseDto } from '../dtos/responses/permission-response.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
    @InjectRepository(SystemUser)
    private readonly systemUserRepository: Repository<SystemUser>,
    private readonly userPermissionsService: UserPermissionsService,
  ) {}

  async findAllPermissions(
    filterDto: FilterPermissionDto,
  ): Promise<PaginationResponseDto<PermissionResponseDto>> {
    const queryBuilder = this.permissionRepository.createQueryBuilder('permission');

    if (filterDto.id) {
      queryBuilder.andWhere('permission.id = :id', { id: filterDto.id });
    }

    if (filterDto.name) {
      queryBuilder.andWhere('(permission.name LIKE :name)', {
        name: `%${filterDto.name}%`,
      });
    }

    return paginate(queryBuilder, filterDto, PermissionResponseDto);
  }

  async findPermissionById(id: number): Promise<PermissionEntity> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: ['rolePermissions', 'rolePermissions.role'],
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    return permission;
  }

  async getPermissionsForRole(roleId: number): Promise<PermissionEntity[]> {
    const permissions = await this.permissionRepository
      .createQueryBuilder('permission')
      .innerJoin('permission.rolePermissions', 'rolePermission')
      .where('rolePermission.roleId = :roleId', { roleId })
      .getMany();
    return permissions;
  }

  async getAllAllowedPermissionsForUser(systemUserId: number): Promise<PermissionEntity[]> {
    const user = await this.systemUserRepository.findOne({
      where: { id: systemUserId },
      relations: ['role', 'role.rolePermissions', 'role.rolePermissions.permission'],
    });

    if (!user) {
      throw new NotFoundException(`System user with ID ${systemUserId} not found`);
    }

    if (!user.role) {
      throw new NotFoundException(`User with ID ${systemUserId} has no role assigned`);
    }

    const userPermissions = await this.userPermissionsService.getUserPermissions(systemUserId);
    const allowedUserPermissions = userPermissions.filter((up) => up.isAllowed);
    const disallowedUserPermissions = userPermissions.filter((up) => !up.isAllowed);

    // Remove disallowed user permissions from role permissions
    const filteredRolePermissions = user.role.rolePermissions.filter(
      (rp) => !disallowedUserPermissions.some((up) => up.permissionId === rp.permissionId),
    );

    // Extract permission entities from filtered role permissions
    const rolePermissions = filteredRolePermissions.map((rp) => rp.permission);

    // Extract permission entities from allowed user permissions
    const userPermissionEntities = allowedUserPermissions.map((up) => up.permission);

    // Combine and remove duplicates based on permission ID
    const allPermissions = [...rolePermissions, ...userPermissionEntities];

    const uniquePermissions = allPermissions.filter(
      (permission, index, self) => index === self.findIndex((p) => p.id === permission.id),
    );

    return uniquePermissions;
  }
}
