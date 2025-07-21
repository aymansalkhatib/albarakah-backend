import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CallStatus } from '../enums/call-status.enum';
import { Person } from '../../persons/entities/person.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { RecipientType } from '../enums/recipient-type.enum';

@Entity('call_logs')
export class CallLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'caller_number', length: 10, nullable: true })
  callerNumber?: string;

  @Column({ name: 'recipient_number', length: 10 })
  recipientNumber: string;

  @Column({
    name: 'caller_type',
    type: 'enum',
    enum: RecipientType,
    nullable: false,
  })
  recipientType: RecipientType;

  @Column({ name: 'receiver_id', nullable: true })
  receiverId?: number;

  @Column({ name: 'person_id', nullable: true })
  personId?: number;

  @Column({
    name: 'call_status',
    type: 'enum',
    enum: CallStatus,
    nullable: false,
  })
  callStatus: CallStatus;

  @Column({ name: 'employee_id', nullable: true })
  employeeId?: number;

  @Column({ name: 'call_date', type: 'timestamp', nullable: false })
  callDate: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee?: Employee;

  @ManyToOne(() => Person)
  @JoinColumn({ name: 'person_id' })
  person?: Person;
}
