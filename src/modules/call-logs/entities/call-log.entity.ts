import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CallStatus } from '../enums/call-status.enum';
import { CallerType } from '../enums/caller-type.enum';
import { Employee } from '@app/modules/employees/entities/employee.entity';

@Entity('call_logs')
export class CallLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'caller_number', length: 10, nullable: true })
  callerNumber?: string;

  @Column({ name: 'receiver_number', length: 10 })
  receiverNumber: string;

  @Column({
    name: 'receiver_type',
    type: 'enum',
    enum: CallerType,
  })
  receiverType: CallerType;

  @Column({ name: 'receiver_id', nullable: true })
  receiverId?: number;

  @Column({ name: 'employee_id', nullable: true })
  employeeId?: number;

  @Column({
    name: 'call_status',
    type: 'enum',
    enum: CallStatus,
  })
  callStatus: CallStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Employee, (employee) => employee.callLogs)
  employee: Employee;
}
