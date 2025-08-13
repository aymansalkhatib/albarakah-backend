import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserPermission } from '../entities/user-permission.entity';
import { PermissionEntity } from '../entities/permissions.entity';
import { SystemUser } from '../../system-users/entities/system-user.entity';
import { UserPermissionItemDto } from '../dtos/requests/bulk-assign-user-permissions.dto';
import { isProtectedRoleName } from '../constants/protected-permissions.constant';
import { AssignUserPermissionDto } from '../dtos/requests/assign-user-permission.dto';

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

  async assignPermissionToUser(assignDto: AssignUserPermissionDto): Promise<UserPermission> {
    // Use Promise.all for concurrent validation
    const [user, permission] = await Promise.all([
      this.systemUserRepository.findOne({
        where: { id: assignDto.systemUserId },
        relations: ['role'],
      }),
      this.permissionRepository.findOne({ where: { id: assignDto.permissionId } }),
    ]);

    if (!user) {
      throw new NotFoundException(`System user with ID ${assignDto.systemUserId} not found`);
    }
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${assignDto.permissionId} not found`);
    }

    // Use upsert for better performance
    const existingPermission = await this.userPermissionRepository.findOne({
      where: {
        systemUserId: assignDto.systemUserId,
        permissionId: assignDto.permissionId,
      },
    });

    // Prevent changing permissions for superadmin users
    if (isProtectedRoleName(user.role.name)) {
      throw new ForbiddenException('Cannot change permissions for superadmin users.');
    }

    if (existingPermission) {
      existingPermission.isAllowed = assignDto.isAllowed;
      return this.userPermissionRepository.save(existingPermission);
    }

    const userPermission = this.userPermissionRepository.create(assignDto);

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

  async bulkAssignUserPermissions(
    userId: number,
    permissionsToAssign: UserPermissionItemDto[],
  ): Promise<UserPermission[]> {
    //
    if (permissionsToAssign.length === 0) return [];
    //
    const permissionIds = permissionsToAssign.map((permission) => permission.permissionId);

    // Validate no duplicate permission IDs
    const uniquePermissionIds = new Set(permissionIds);

    if (permissionIds.length !== uniquePermissionIds.size) {
      const duplicateIds = permissionIds.filter((id, index) => permissionIds.indexOf(id) !== index);
      const uniqueDuplicates = [...new Set(duplicateIds)];
      throw new BadRequestException(
        `Duplicate permission IDs found: ${uniqueDuplicates.join(', ')}`,
      );
    }

    // Validate user exists and get role information
    const user = await this.systemUserRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Validate user is not protected (superadmin)
    if (isProtectedRoleName(user.role.name)) {
      throw new ForbiddenException(
        'Cannot modify permissions for protected users with superadmin role',
      );
    }
    // Validate all permissions exist
    const existingPermissions = await this.permissionRepository.find({
      where: { id: In(permissionIds) },
      select: ['id'],
    });

    if (existingPermissions.length !== permissionIds.length) {
      const foundIds = existingPermissions.map((permission) => permission.id);
      const missingIds = permissionIds.filter((id) => !foundIds.includes(id));

      throw new BadRequestException(`Permissions with IDs ${missingIds.join(', ')} not found`);
    }

    // Get existing user permissions for efficient updates
    const existingUserPermissions = await this.userPermissionRepository.find({
      where: {
        systemUserId: userId,
        permissionId: In(permissionIds),
      },
      relations: ['permission'],
    });

    // Create map for efficient lookup of existing permissions
    const existingPermissionMap = new Map(
      existingUserPermissions.map((permission) => [permission.permissionId, permission]),
    );

    const permissionsToCreate: Partial<UserPermission>[] = [];
    const permissionsToUpdate: UserPermission[] = [];

    // Categorize permissions for create vs update operations
    permissionsToAssign.forEach((permissionAssignment) => {
      const existingPermission = existingPermissionMap.get(permissionAssignment.permissionId);

      if (existingPermission) {
        existingPermission.isAllowed = permissionAssignment.isAllowed;
        permissionsToUpdate.push(existingPermission);
      } else {
        permissionsToCreate.push({
          systemUserId: userId,
          permissionId: permissionAssignment.permissionId,
          isAllowed: permissionAssignment.isAllowed,
        });
      }
    });

    // Execute bulk database operations
    const operations: Promise<any>[] = [];

    if (permissionsToCreate.length > 0) {
      operations.push(this.userPermissionRepository.save(permissionsToCreate));
    }

    if (permissionsToUpdate.length > 0) {
      operations.push(this.userPermissionRepository.save(permissionsToUpdate));
    }

    await Promise.all(operations);

    // Return all user permissions after changes
    return this.getUserPermissions(userId);
  }

  async removeAllUserPermissions(systemUserId: number): Promise<void> {
    const userExists = await this.systemUserRepository.exists({ where: { id: systemUserId } });
    if (!userExists) {
      throw new NotFoundException(`System user with ID ${systemUserId} not found`);
    }
    await this.userPermissionRepository.delete({ systemUserId });
  }
}
