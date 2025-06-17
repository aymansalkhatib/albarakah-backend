import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RolePermission } from './role-permission.entity';
import { UserPermission } from './user-permission.entity';
import { Permission } from '../enums/permission.enum';

@Entity('permissions')
export class PermissionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'enum', enum: Permission })
  name: Permission;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // Relationships

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.permission)
  rolePermissions: RolePermission[];

  @OneToMany(() => UserPermission, (userPermission) => userPermission.permission)
  userPermissions: UserPermission[];
}
