import { QueryRunner } from 'typeorm';
import { PermissionEntity } from '../../modules/roles/entities/permissions.entity';
import { RolePermission } from '../../modules/roles/entities/role-permission.entity';
import { Role } from '../../modules/roles/entities/roles.entity';
import { Permission } from '../../modules/roles/enums/permission.enum';

export async function seedRolesAndPermissions(queryRunner: QueryRunner) {
  const permissionRepo = queryRunner.manager.getRepository(PermissionEntity);
  const roleRepo = queryRunner.manager.getRepository(Role);
  const rolePermissionRepo = queryRunner.manager.getRepository(RolePermission);

  const allPermissions = Object.values(Permission);

  // 1. Insert permissions
  const permissionEntities = await Promise.all(
    allPermissions.map(async (perm) => {
      let p = await permissionRepo.findOne({ where: { name: perm } });
      if (!p) {
        p = permissionRepo.create({ name: perm, description: perm });
        await permissionRepo.save(p);
      }
      return p;
    }),
  );

  // 2. Insert roles
  const rolesData = [
    {
      name: 'Superadmin',
      description:
        'Super Admin role with all permissions including system management',
    },
    {
      name: 'Admin',
      description:
        'Admin role with business operations permissions (excluding system/employee management)',
    },
    { name: 'Viewer', description: 'Read-only access to all data' },
  ];

  const roles: Record<string, Role> = {};
  for (const data of rolesData) {
    let role = await roleRepo.findOne({ where: { name: data.name } });
    if (!role) {
      role = roleRepo.create(data);
      await roleRepo.save(role);
    }
    roles[data.name] = role;
  }

  // 3. Define restricted and read-only
  const restrictedForAdmin: Permission[] = [
    Permission.CREATE_ROLE,
    Permission.READ_ROLE,
    Permission.UPDATE_ROLE,
    Permission.DELETE_ROLE,
    Permission.CREATE_PERMISSION,
    Permission.READ_PERMISSION,
    Permission.UPDATE_PERMISSION,
    Permission.DELETE_PERMISSION,
    Permission.CREATE_USER_PERMISSION,
    Permission.READ_USER_PERMISSION,
    Permission.DELETE_USER_PERMISSION,
    Permission.CREATE_SYSTEM_USER,
    Permission.READ_SYSTEM_USER,
    Permission.UPDATE_SYSTEM_USER,
    Permission.DELETE_SYSTEM_USER,
    Permission.CREATE_EMPLOYEE,
    Permission.READ_EMPLOYEE,
    Permission.UPDATE_EMPLOYEE,
    Permission.DELETE_EMPLOYEE,
  ];

  const readOnlyPermissions = allPermissions.filter((p) =>
    p.startsWith('read_'),
  );

  // 4. Assign permissions
  const assign = async (role: Role, perms: PermissionEntity[]) => {
    await Promise.all(
      perms.map(async (perm) => {
        const exists = await rolePermissionRepo.findOne({
          where: { roleId: role.id, permissionId: perm.id },
        });
        if (!exists) {
          await rolePermissionRepo.save(
            rolePermissionRepo.create({
              roleId: role.id,
              permissionId: perm.id,
            }),
          );
        }
      }),
    );
  };

  await assign(roles.Superadmin, permissionEntities); // all permissions
  await assign(
    roles.Admin,
    permissionEntities.filter(
      (p) => !restrictedForAdmin.includes(p.name as Permission),
    ),
  );
  await assign(
    roles.Viewer,
    permissionEntities.filter((p) => readOnlyPermissions.includes(p.name)),
  );

  console.log('🎉 Roles and permissions seeding completed successfully!');
}
