import { Employee } from 'src/modules/employees/entities/employee.entity';
import { Role } from 'src/modules/roles/entities/roles.entity';
import { UserPermission } from 'src/modules/roles/entities/user-permission.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

@Entity('user_accounts')
export class UserAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'employees_id', nullable: true })
  employeesId?: number;

  @Column({ name: 'role_id', nullable: true })
  roleId?: number;

  @ManyToOne(() => Role, (role) => role.userAccounts, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'role_id' })
  role?: Role;

  @Column({ length: 100, unique: true })
  username: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ name: 'last_login', type: 'timestamp', nullable: true })
  lastLogin?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => UserPermission, (userPermission) => userPermission.userAccount)
  userPermissions: UserPermission[];

  @OneToOne(() => Employee, (employee) => employee.userAccount, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'employees_id' })
  employee?: Employee;
}
