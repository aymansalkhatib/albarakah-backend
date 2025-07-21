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
import { FamilyMember } from '../../beneficiary-families/entities/family-members.entity';
import { CallerType } from '../enums/caller-type.enum';

@Entity('call_logs')
export class CallLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'caller_number', length: 10, nullable: true })
  callerNumber?: string;

  @Column({ name: 'recipient_number', length: 10 })
  recipientNumber: string;

  @Column({
    name: 'call_status',
    type: 'enum',
    enum: CallStatus,
    nullable: false,
  })
  callStatus: CallStatus;

  @Column({
    name: 'caller_type',
    type: 'enum',
    enum: CallerType,
    nullable: false,
  })
  callerType: CallerType;

  @Column({ name: 'receiver_id', nullable: false })
  receiverId: number;

  @Column({ name: 'employee_id', nullable: true })
  employeeId?: number;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @Column({ name: 'family_id', nullable: true })
  familyId?: number;

  @Column({ name: 'family_member_id', nullable: true })
  familyMemberId?: number;

  @Column({ name: 'child_id', nullable: true })
  childId?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  // Relationships
  @ManyToOne(() => Person, { eager: false })
  @JoinColumn({ name: 'receiver_id' })
  receiver?: Person;

  @ManyToOne(() => Person, { eager: false })
  @JoinColumn({ name: 'caller_number', referencedColumnName: 'phone' })
  caller?: Person;

  @ManyToOne(() => Employee, { eager: false })
  @JoinColumn({ name: 'employee_id' })
  employee?: Employee;

  @ManyToOne(() => FamilyMember, (member) => member.callLogs, {
    onDelete: 'RESTRICT',
    nullable: true,
  })
  @JoinColumn({ name: 'family_member_id' })
  familyMember?: FamilyMember;
}
