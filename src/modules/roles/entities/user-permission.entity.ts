import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { PermissionEntity } from './permissions.entity';
import { SystemUser } from '../../system-users/entities/system-user.entity';

@Entity('user_permissions')
@Unique(['systemUserId', 'permissionId'])
export class UserPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'system_user_id' })
  systemUserId: number;

  @Column({ name: 'permission_id' })
  permissionId: number;

  @Column({ name: 'is_allowed' })
  isAllowed: boolean;

  // Relationships

  @ManyToOne(() => SystemUser, (systemUser) => systemUser.userPermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'system_user_id' })
  systemUser: SystemUser;

  @ManyToOne(() => PermissionEntity, (permission) => permission.userPermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'permission_id' })
  permission: PermissionEntity;
}
