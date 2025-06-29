import { Permission } from '../../modules/roles/enums/permission.enum';
import { PermissionEntity } from '../../modules/roles/entities/permissions.entity';
import { Role } from '../../modules/roles/entities/roles.entity';
import { RolePermission } from '../../modules/roles/entities/role-permission.entity';
import { QueryRunner } from 'typeorm';
import { PROTECTED_SYSTEM_USER_PERMISSIONS } from '../../modules/roles/constants/protected-permissions.constant';

export async function seedRolesAndPermissions(queryRunner: QueryRunner) {
  const permissionRepo = queryRunner.manager.getRepository(PermissionEntity);
  const roleRepo = queryRunner.manager.getRepository(Role);
  const rolePermissionRepo = queryRunner.manager.getRepository(RolePermission);

  // System user permissions - only for superadmin (using protected constant)
  const systemUserPermissions = PROTECTED_SYSTEM_USER_PERMISSIONS;

  // 1. Insert all permissions if not exist
  const allPermissions = Object.values(Permission);
  for (const perm of allPermissions) {
    let permission = await permissionRepo.findOne({ where: { name: perm } });
    if (!permission) {
      permission = permissionRepo.create({ name: perm, description: perm });
      await permissionRepo.save(permission);
    }
  }

  // 2. Create roles
  let adminRole = await roleRepo.findOne({ where: { name: 'admin' } });
  if (!adminRole) {
    adminRole = roleRepo.create({ name: 'admin', description: 'Admin role' });
    await roleRepo.save(adminRole);
  }

  let superAdminRole = await roleRepo.findOne({ where: { name: 'superadmin' } });
  if (!superAdminRole) {
    superAdminRole = roleRepo.create({ name: 'superadmin', description: 'Super Admin role' });
    await roleRepo.save(superAdminRole);
  }

  // 3. Assign permissions
  const allPermissionEntities = await permissionRepo.find();

  // Assign permissions based on role
  for (const perm of allPermissionEntities) {
    // Check if this is a system user permission
    const isSystemUserPermission = systemUserPermissions.includes(perm.name as Permission);

    // Admin role - gets all permissions EXCEPT system user permissions
    if (!isSystemUserPermission) {
      const adminExists = await rolePermissionRepo.findOne({
        where: { roleId: adminRole.id, permissionId: perm.id },
      });
      if (!adminExists) {
        await rolePermissionRepo.save(
          rolePermissionRepo.create({ roleId: adminRole.id, permissionId: perm.id }),
        );
      }
    }

    // Superadmin role - gets ALL permissions
    const superExists = await rolePermissionRepo.findOne({
      where: { roleId: superAdminRole.id, permissionId: perm.id },
    });
    if (!superExists) {
      await rolePermissionRepo.save(
        rolePermissionRepo.create({ roleId: superAdminRole.id, permissionId: perm.id }),
      );
    }
  }
}
