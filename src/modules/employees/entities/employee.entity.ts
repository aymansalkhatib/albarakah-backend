import { Person } from '../../persons/entities/person.entity';
import {
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
import { Interview } from '../../interviews/entities/interview.entity';
import { SystemUser } from '../../system-users/entities/system-user.entity';
import { CallLog } from '@app/modules/call-logs/entities/call-log.entity';

@Entity('employees')
@Index('idx_employees_person_id', ['personId'], { unique: true })
@Index('idx_employees_position', ['position'])
@Index('idx_employees_hire_date', ['hireDate'])
@Index('idx_employees_termination_date', ['terminationDate'])
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

  @ManyToOne(() => Person, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @OneToOne(() => SystemUser, (systemUser) => systemUser.employee, {
    cascade: true,
  })
  systemUser?: SystemUser;

  @OneToMany(() => Interview, (interview) => interview.interviewer, {
    cascade: true,
  })
  interviews: Interview[];

  @OneToMany(() => CallLog, (callLog) => callLog.employee, {
    cascade: true,
  })
  callLogs: CallLog[];
}
