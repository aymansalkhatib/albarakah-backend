import { Employee } from 'src/modules/employees/entities/employee.entity';
import { Role } from 'src/modules/roles/entities/roles.entity';
import { UserPermission } from 'src/modules/roles/entities/user-permission.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_accounts')
@Index(['username'], { unique: true })
@Index(['employeesId'], { unique: true, where: 'employees_id IS NOT NULL' })
@Index(['roleId'])
@Index(['lastLogin'])
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships

  @OneToMany(() => UserPermission, (userPermission) => userPermission.userAccount)
  userPermissions: UserPermission[];

  @OneToOne(() => Employee, (employee) => employee.userAccount, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'employees_id' })
  employee?: Employee;
}
