import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
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

  @Column({ type: 'date', nullable: true })
  hireDate?: Date;

  @Column({ type: 'date', nullable: true })
  terminationDate?: Date;

  @Column({ type: 'text', nullable: true })
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
