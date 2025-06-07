import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Permission } from './permissions.entity';
import { UserAccount } from 'src/modules/users/entities/user-accounts.entity';

@Entity('user_permissions')
export class UserPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_accounts_id' })
  userAccountsId: number;

  @Column({ name: 'permission_id' })
  permissionId: number;

  @Column({ name: 'is_allowed', default: true })
  isAllowed: boolean;

  // Relationships

  @ManyToOne(() => UserAccount, (userAccount) => userAccount.userPermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_accounts_id' })
  userAccount: UserAccount;

  @ManyToOne(() => Permission, (permission) => permission.userPermissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}
