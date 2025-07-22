import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CallStatus } from '../enums/call-status.enum';
import { Person } from '../../persons/entities/person.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { ExternalPartyType } from '../enums/recipient-type.enum';
import { CallDirection } from '../enums/call-direction.enum';

@Entity('call_logs')
export class CallLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'caller_number', length: 10, nullable: true })
  callerNumber?: string;

  @Column({ name: 'recipient_number', length: 10 })
  recipientNumber: string;

  @Column({
    type: 'enum',
    enum: ExternalPartyType,
    nullable: false,
  })
  externalPartyType: ExternalPartyType;

  @Column({ name: 'responsible_employee_id', nullable: true })
  responsibleEmployeeId?: number;

  @Column({ name: 'external_party_id', nullable: true })
  externalPartyId?: number;

  @Column({
    type: 'enum',
    enum: CallDirection,
    nullable: false,
  })
  callDirection: CallDirection;

  @Column({
    name: 'call_status',
    type: 'enum',
    enum: CallStatus,
    nullable: false,
  })
  callStatus: CallStatus;

  @Column({
    name: 'call_date',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  callDate: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'responsible_employee_id' })
  responsibleEmployee?: Employee;

  @ManyToOne(() => Person)
  @JoinColumn({ name: 'external_party_id' })
  externalParty?: Person;
}
