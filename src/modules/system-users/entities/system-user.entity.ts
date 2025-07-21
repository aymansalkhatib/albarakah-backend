import { Employee } from '../../employees/entities/employee.entity';
import { Role } from '../../roles/entities/roles.entity';
import { UserPermission } from '../../roles/entities/user-permission.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import * as bcrypt from 'bcrypt';

@Entity('system_users')
@Index('idx_system_users_username', ['username'], { unique: true })
@Index('idx_system_users_employee_id', ['employeeId'], { unique: true })
@Index('idx_system_users_role_id', ['roleId'])
@Index('idx_system_users_last_login', ['lastLogin'])
export class SystemUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'employee_id' })
  employeeId: number;

  @Column({ name: 'role_id' })
  roleId: number;

  @ManyToOne(() => Role, (role) => role.systemUsers, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ length: 100 })
  username: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ name: 'last_login', type: 'timestamp', nullable: true })
  lastLogin?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'password_changed_at', type: 'timestamp', nullable: true })
  passwordChangedAt?: Date;

  // Relationships

  @OneToMany(() => UserPermission, (userPermission) => userPermission.systemUser)
  userPermissions: UserPermission[];

  @OneToOne(() => Employee, (employee) => employee.systemUser, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password || this.password.startsWith('$2b$')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.passwordChangedAt = new Date();
    console.log(this.passwordChangedAt);
  }
}
