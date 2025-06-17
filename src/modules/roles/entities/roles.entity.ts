import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RolePermission } from './role-permission.entity';
import { SystemUser } from 'src/modules/users/entities/system-user.entity';

@Entity('roles')
@Index("idx_roles_name", ["name"], { unique: true })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // Relationships

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: RolePermission[];

  @OneToMany(() => SystemUser, (systemUser) => systemUser.role)
  systemUsers: SystemUser[];
}
