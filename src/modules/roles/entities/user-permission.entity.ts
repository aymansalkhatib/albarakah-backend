import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PermissionEntity } from './permissions.entity';
import { SystemUser } from 'src/modules/users/entities/system-user.entity';

@Entity('user_permissions')
export class UserPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_accounts_id' })
  userAccountsId: number;

  @Column({ name: 'permission_id' })
  permissionId: number;

  @Column({ name: 'is_allowed' })
  isAllowed: boolean;

  // Relationships

  @ManyToOne(() => SystemUser, (systemUser) => systemUser.userPermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_accounts_id' })
  systemUser: SystemUser;

  @ManyToOne(() => PermissionEntity, (permission) => permission.userPermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'permission_id' })
  permission: PermissionEntity;
}
