import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { PermissionEntity } from './permissions.entity';
import { Role } from './roles.entity';

@Entity('role_permissions')
@Unique('UQ_role_permission_roleId_permissionId', ['roleId', 'permissionId'])
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'permission_id' })
  permissionId: number;

  @Column({ name: 'role_id' })
  roleId: number;

  // Relationships

  @ManyToOne(
    () => PermissionEntity,
    (permission) => permission.rolePermissions,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'permission_id' })
  permission: PermissionEntity;

  @ManyToOne(() => Role, (role) => role.rolePermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
