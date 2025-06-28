import { Permission } from '../../modules/roles/enums/permission.enum';
import { PermissionEntity } from '../../modules/roles/entities/permissions.entity';
import { Role } from '../../modules/roles/entities/roles.entity';
import { RolePermission } from '../../modules/roles/entities/role-permission.entity';
import { QueryRunner } from 'typeorm';

export async function seedRolesAndPermissions(queryRunner: QueryRunner) {
  const permissionRepo = queryRunner.manager.getRepository(PermissionEntity);
  const roleRepo = queryRunner.manager.getRepository(Role);
  const rolePermissionRepo = queryRunner.manager.getRepository(RolePermission);

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

  // Assign all permissions to both roles (no CREATE_SYSTEM_USER in Permission enum)
  for (const perm of allPermissionEntities) {
    // Admin
    const adminExists = await rolePermissionRepo.findOne({
      where: { roleId: adminRole.id, permissionId: perm.id },
    });
    if (!adminExists) {
      await rolePermissionRepo.save(
        rolePermissionRepo.create({ roleId: adminRole.id, permissionId: perm.id }),
      );
    }
    // Superadmin
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
