import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RolePermission } from './role-permission.entity';
import { SystemUser } from '../../system-users/entities/system-user.entity';

@Entity('roles')
@Index('idx_roles_name', ['name'], { unique: true })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role, { cascade: true })
  rolePermissions: RolePermission[];

  @OneToMany(() => SystemUser, (systemUser) => systemUser.role)
  systemUsers: SystemUser[];
}
