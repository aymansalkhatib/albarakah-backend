import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Permission } from '../enums/permission.enum';
import { RolePermission } from './role-permission.entity';
import { UserPermission } from './user-permission.entity';

@Entity('permissions')
export class PermissionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'enum', enum: Permission })
  name: Permission;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // Relationships

  @OneToMany(
    () => RolePermission,
    (rolePermission) => rolePermission.permission,
  )
  rolePermissions: RolePermission[];

  @OneToMany(
    () => UserPermission,
    (userPermission) => userPermission.permission,
  )
  userPermissions: UserPermission[];
}
