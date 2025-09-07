import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Person } from '../../persons/entities/person.entity';
import { SystemUser } from '../../system-users/entities/system-user.entity';

@Entity('employees')
@Index('idx_employees_person_id', ['personId'], { unique: true })
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'person_id', unique: true })
  personId: number;

  @Column({ length: 100, nullable: true })
  position?: string;

  @Column({ name: 'hire_date', type: 'date', nullable: true })
  hireDate?: Date;

  @Column({ name: 'termination_date', type: 'date', nullable: true })
  terminationDate?: Date;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Person, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @OneToOne(() => SystemUser, (systemUser) => systemUser.employee, {
    cascade: true,
  })
  systemUser?: SystemUser;
}
