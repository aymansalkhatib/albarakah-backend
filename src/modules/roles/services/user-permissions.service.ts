import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UserPermission } from '../entities/user-permission.entity';
import { PermissionEntity } from '../entities/permissions.entity';
import { SystemUser } from '../../system-users/entities/system-user.entity';
import { UserPermissionItemDto } from '../dtos/requests/bulk-assign-user-permissions.dto';
import { RolePermission } from '../entities/role-permission.entity';
import { isProtectedSystemUserPermission } from '../constants/protected-permissions.constant';

@Injectable()
export class UserPermissionsService {
  constructor(
    @InjectRepository(UserPermission)
    private readonly userPermissionRepository: Repository<UserPermission>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
    @InjectRepository(SystemUser)
    private readonly systemUserRepository: Repository<SystemUser>,
  ) {}

  async assignPermissionToUser(
    systemUserId: number,
    permissionId: number,
    isAllowed: boolean = true,
  ): Promise<UserPermission> {
    // Use Promise.all for concurrent validation
    const [user, permission] = await Promise.all([
      this.systemUserRepository.findOne({ where: { id: systemUserId } }),
      this.permissionRepository.findOne({ where: { id: permissionId } }),
    ]);

    if (!user) {
      throw new NotFoundException(`System user with ID ${systemUserId} not found`);
    }
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${permissionId} not found`);
    }

    // Use upsert for better performance
    const existingPermission = await this.userPermissionRepository.findOne({
      where: { systemUserId, permissionId },
    });

    this.validateSystemUserPermissions([permission]);

    if (existingPermission) {
      existingPermission.isAllowed = isAllowed;
      return this.userPermissionRepository.save(existingPermission);
    }

    const userPermission = this.userPermissionRepository.create({
      systemUserId,
      permissionId,
      isAllowed,
    });

    return this.userPermissionRepository.save(userPermission);
  }

  async getUserPermissions(systemUserId: number): Promise<UserPermission[]> {
    // Validate user exists first
    const userExists = await this.systemUserRepository.exists({ where: { id: systemUserId } });
    if (!userExists) {
      throw new NotFoundException(`System user with ID ${systemUserId} not found`);
    }

    return this.userPermissionRepository.find({
      where: { systemUserId },
      relations: ['permission'],
      order: { id: 'ASC' },
    });
  }

  async removeUserPermission(systemUserId: number, permissionId: number): Promise<void> {
    const result = await this.userPermissionRepository.delete({
      systemUserId,
      permissionId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `Permission ${permissionId} is not assigned to user ${systemUserId}`,
      );
    }
  }

  async bulkAssignPermissions(
    systemUserId: number,
    permissions: UserPermissionItemDto[],
  ): Promise<UserPermission[]> {
    if (!permissions.length) return [];

    // Check for duplicate permission IDs
    const permissionIds = permissions.map((p) => p.permissionId);
    const uniquePermissionIds = new Set(permissionIds);
    if (permissionIds.length !== uniquePermissionIds.size) {
      const duplicates = permissionIds.filter((id, index) => permissionIds.indexOf(id) !== index);
      throw new BadRequestException(
        `Duplicate permission IDs found: ${[...new Set(duplicates)].join(', ')}`,
      );
    }

    // Validate user exists
    const userExists = await this.systemUserRepository.exists({ where: { id: systemUserId } });
    if (!userExists) {
      throw new NotFoundException(`System user with ID ${systemUserId} not found`);
    }

    // Validate all permissions exist
    const existingPermissions = await this.permissionRepository.find({
      where: { id: In(permissionIds) },
    });

    if (existingPermissions.length !== permissionIds.length) {
      const foundIds = existingPermissions.map((p) => p.id);
      const missingIds = permissionIds.filter((id) => !foundIds.includes(id));
      throw new BadRequestException(`Permissions with IDs ${missingIds.join(', ')} not found`);
    }

    // Get existing user permissions for efficient updates
    const existingUserPermissions = await this.userPermissionRepository.find({
      where: { systemUserId, permissionId: In(permissionIds) },
    });

    this.validateSystemUserPermissions(existingUserPermissions.map((up) => up.permission));

    const existingMap = new Map(existingUserPermissions.map((up) => [up.permissionId, up]));

    const toCreate: Partial<UserPermission>[] = [];
    const toUpdate: UserPermission[] = [];

    for (const perm of permissions) {
      const existing = existingMap.get(perm.permissionId);
      if (existing) {
        existing.isAllowed = perm.isAllowed;
        toUpdate.push(existing);
      } else {
        toCreate.push({
          systemUserId,
          permissionId: perm.permissionId,
          isAllowed: perm.isAllowed,
        });
      }
    }

    // Execute bulk operations
    await Promise.all([
      toCreate.length > 0 ? this.userPermissionRepository.save(toCreate) : [],
      toUpdate.length > 0 ? this.userPermissionRepository.save(toUpdate) : [],
    ]);

    // Return all permissions after changes
    return this.getUserPermissions(systemUserId);
  }

  async removeAllUserPermissions(systemUserId: number): Promise<void> {
    const userExists = await this.systemUserRepository.exists({ where: { id: systemUserId } });
    if (!userExists) {
      throw new NotFoundException(`System user with ID ${systemUserId} not found`);
    }
    await this.userPermissionRepository.delete({ systemUserId });
  }

  private validateSystemUserPermissions(permissions: PermissionEntity[]): void {
    const protectedPermissions = permissions.filter((p) => isProtectedSystemUserPermission(p.name));

    if (protectedPermissions.length > 0) {
      const protectedNames = protectedPermissions.map((p) => p.name).join(', ');
      throw new ForbiddenException(
        `System user management permissions (${protectedNames}) can only be assigned to superadmin role. These permissions are protected and cannot be modified.`,
      );
    }
  }
}
