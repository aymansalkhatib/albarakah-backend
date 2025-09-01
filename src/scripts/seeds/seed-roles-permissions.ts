import { Permission } from '../../modules/roles/enums/permission.enum';
import { PermissionEntity } from '../../modules/roles/entities/permissions.entity';
import { Role } from '../../modules/roles/entities/roles.entity';
import { RolePermission } from '../../modules/roles/entities/role-permission.entity';
import { QueryRunner } from 'typeorm';

export async function seedRolesAndPermissions(queryRunner: QueryRunner) {
  console.log('🌱 Starting roles and permissions seeding...');

  const permissionRepo = queryRunner.manager.getRepository(PermissionEntity);
  const roleRepo = queryRunner.manager.getRepository(Role);
  const rolePermissionRepo = queryRunner.manager.getRepository(RolePermission);

  // 1. Insert all permissions if not exist
  console.log('📋 Creating permissions...');
  const allPermissions = Object.values(Permission);
  for (const perm of allPermissions) {
    let permission = await permissionRepo.findOne({ where: { name: perm } });
    if (!permission) {
      permission = permissionRepo.create({ name: perm, description: perm });
      await permissionRepo.save(permission);
      console.log(`✅ Created permission: ${perm}`);
    }
  }

  // 2. Create roles
  console.log('👥 Creating roles...');

  // Create Super Admin role
  let superAdminRole = await roleRepo.findOne({ where: { name: 'superadmin' } });
  if (!superAdminRole) {
    superAdminRole = roleRepo.create({
      name: 'superadmin',
      description: 'Super Admin role with all permissions including system management',
    });
    await roleRepo.save(superAdminRole);
    console.log('✅ Created superadmin role');
  }

  // Create Admin role
  let adminRole = await roleRepo.findOne({ where: { name: 'admin' } });
  if (!adminRole) {
    adminRole = roleRepo.create({
      name: 'admin',
      description:
        'Admin role with business operations permissions (excluding system/employee management)',
    });
    await roleRepo.save(adminRole);
    console.log('✅ Created admin role');
  }

  // Create Viewer role
  let viewerRole = await roleRepo.findOne({ where: { name: 'viewer' } });
  if (!viewerRole) {
    viewerRole = roleRepo.create({
      name: 'viewer',
      description: 'Read-only access to all data',
    });
    await roleRepo.save(viewerRole);
    console.log('✅ Created viewer role');
  }

  // 3. Define restricted permissions for admin role
  const restrictedPermissionsForAdmin: Permission[] = [
    // Role Management
    Permission.CREATE_ROLE,
    Permission.READ_ROLE,
    Permission.UPDATE_ROLE,
    Permission.DELETE_ROLE,

    // Permission Management
    Permission.CREATE_PERMISSION,
    Permission.READ_PERMISSION,
    Permission.UPDATE_PERMISSION,
    Permission.DELETE_PERMISSION,

    // User Permissions Management
    Permission.CREATE_USER_PERMISSION,
    Permission.READ_USER_PERMISSION,
    Permission.DELETE_USER_PERMISSION,

    // System User Management
    Permission.CREATE_SYSTEM_USER,
    Permission.READ_SYSTEM_USER,
    Permission.UPDATE_SYSTEM_USER,
    Permission.DELETE_SYSTEM_USER,

    // Employee Management
    Permission.CREATE_EMPLOYEE,
    Permission.READ_EMPLOYEE,
    Permission.UPDATE_EMPLOYEE,
    Permission.DELETE_EMPLOYEE,
  ];

  // 4. Get read-only permissions for viewer role
  const readOnlyPermissions = allPermissions.filter((perm) => perm.startsWith('read_'));

  // 5. Assign permissions
  console.log('🔗 Assigning permissions...');
  const allPermissionEntities = await permissionRepo.find();

  for (const perm of allPermissionEntities) {
    const permissionName = perm.name;

    // Super Admin - gets ALL permissions
    const superExists = await rolePermissionRepo.findOne({
      where: { roleId: superAdminRole.id, permissionId: perm.id },
    });
    if (!superExists) {
      await rolePermissionRepo.save(
        rolePermissionRepo.create({ roleId: superAdminRole.id, permissionId: perm.id }),
      );
      console.log(`⭐ Assigned permission ${perm.name} to superadmin`);
    }

    // Admin - gets all permissions EXCEPT restricted ones
    if (!restrictedPermissionsForAdmin.includes(permissionName)) {
      const adminExists = await rolePermissionRepo.findOne({
        where: { roleId: adminRole.id, permissionId: perm.id },
      }); 
      if (!adminExists) {
        await rolePermissionRepo.save(
          rolePermissionRepo.create({ roleId: adminRole.id, permissionId: perm.id }),
        );
        console.log(`👤 Assigned permission ${perm.name} to admin`);
      }
    }

    // Viewer - gets only read permissions
    if (readOnlyPermissions.includes(permissionName)) {
      const viewerExists = await rolePermissionRepo.findOne({
        where: { roleId: viewerRole.id, permissionId: perm.id },
      });
      if (!viewerExists) {
        await rolePermissionRepo.save(
          rolePermissionRepo.create({ roleId: viewerRole.id, permissionId: perm.id }),
        );
        console.log(`👁️ Assigned permission ${perm.name} to viewer`);
      }
    }
  }

  console.log('🎉 Roles and permissions seeding completed');
  console.log(`
📊 Summary:
- Super Admin: ${allPermissions.length} permissions (ALL)
- Admin: ${allPermissions.length - restrictedPermissionsForAdmin.length} permissions (excluding system/employee management)
- Viewer: ${readOnlyPermissions.length} permissions (read-only access)
  `);
}
