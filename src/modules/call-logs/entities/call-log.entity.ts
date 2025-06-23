import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BeneficiaryFamily } from '../../beneficiary-families/entities/beneficiary-families.entity';
import { CallStatus } from '../enums/call-status.enum';
import { FamilyMember } from '../../beneficiary-families/entities/family-members.entity';
import { Child } from '../../children/entities/children.entity';

@Entity('call_logs')
@Index(['familyId'])
@Index(['familyMemberId'])
@Index(['callStatus'])
@Index(['createdAt'])
export class CallLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'family_id', nullable: true })
  familyId?: number;

  @Column({ name: 'family_member_id', nullable: true })
  familyMemberId?: number;

  @Column({ name: 'caller_number', length: 20 })
  callerNumber: string;

  @Column({ name: 'receiver_number', length: 20 })
  receiverNumber: string;

  @Column({
    name: 'call_status',
    type: 'enum',
    enum: CallStatus,
    nullable: true,
  })
  callStatus?: CallStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  // Relationships

  @ManyToOne(() => BeneficiaryFamily, (family) => family.callLogs, {
    onDelete: 'RESTRICT',
    nullable: true,
  })
  @JoinColumn({ name: 'family_id' })
  family?: BeneficiaryFamily;

  @ManyToOne(() => FamilyMember, (familyMember) => familyMember.callLogs, {
    onDelete: 'RESTRICT',
    nullable: true,
  })
  @JoinColumn({ name: 'family_member_id' })
  familyMember?: FamilyMember;

  @ManyToOne(() => Child, (child) => child.callLogs, {
    onDelete: 'RESTRICT',
    nullable: true,
  })
  @JoinColumn({ name: 'child_id' })
  child?: Child;
}
