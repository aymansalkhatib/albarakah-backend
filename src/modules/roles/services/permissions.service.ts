import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionEntity } from '../entities/permissions.entity';
import { FilterPermissionDto } from '../dtos/queries/filter-permission.dto';
import { SystemUser } from '../../../modules/system-users/entities/system-user.entity';
import { UserPermissionsService } from './user-permissions.service';
import { paginate } from '../../../common/pagination/paginate.service';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
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

    if (filterDto.name) {
      queryBuilder.andWhere('permission.name = :name', {
        name: filterDto.name,
      });
    }

    if (filterDto.description) {
      queryBuilder.andWhere('(permission.description ILIKE :description)', {
        description: `%${filterDto.description}%`,
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

  async getEffectiveUserPermissions(userId: number): Promise<PermissionEntity[]> {
    // Fetch user with role permissions
    const user = await this.systemUserRepository.findOne({
      where: { id: userId },
      relations: ['role', 'role.rolePermissions', 'role.rolePermissions.permission'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Fetch and categorize user-specific permissions
    const allUserPermissions = await this.userPermissionsService.getUserPermissions(userId);
    const allowedUserPermissions = allUserPermissions.filter((permission) => permission.isAllowed);
    const deniedUserPermissions = allUserPermissions.filter((permission) => !permission.isAllowed);

    // Create set of denied permission IDs for efficient lookup
    const deniedPermissionIds = new Set(
      deniedUserPermissions.map((permission) => permission.permissionId),
    );

    // Filter role permissions, excluding denied user permissions
    const effectiveRolePermissions = user.role.rolePermissions.filter(
      (rolePermission) => !deniedPermissionIds.has(rolePermission.permissionId),
    );

    // Extract permission entities from both sources
    const permissionsFromRole = effectiveRolePermissions.map((rp) => rp.permission);
    const permissionsFromUser = allowedUserPermissions.map((up) => up.permission);

    // Combine and remove duplicates using Map for O(n) complexity
    const allEffectivePermissions = [...permissionsFromRole, ...permissionsFromUser];
    const uniquePermissionsMap = new Map<number, PermissionEntity>();

    allEffectivePermissions.forEach((permission) => {
      uniquePermissionsMap.set(permission.id, permission);
    });

    return Array.from(uniquePermissionsMap.values());
  }
}
