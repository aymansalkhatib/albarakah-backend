import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { CallStatus } from '../enums/call-status.enum';
import { CallerTypeEnum } from '../enums/caller-type.enum';
import { Person } from '../../persons/entities/person.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { BeneficiaryFamily } from '../../beneficiary-families/entities/beneficiary-families.entity';
import { FamilyMember } from '../../beneficiary-families/entities/family-members.entity';
import { Child } from '../../children/entities/children.entity';

@Entity('call_logs')
@Index(['callerNumber'])
@Index(['recipientNumber'])
@Index(['callStatus'])
@Index(['createdAt'])
@Index(['employeeId'])
@Index(['familyId'])
@Index(['familyMemberId'])
export class CallLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'caller_number', length: 20, nullable: true })
  callerNumber?: string;

  @Column({ name: 'recipient_number', length: 20 })
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
    enum: CallerTypeEnum,
    nullable: false,
  })
  callerType: CallerTypeEnum;

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

  @ManyToOne(() => BeneficiaryFamily, (family) => family.callLogs, {
    onDelete: 'RESTRICT',
    nullable: true,
  })
  @JoinColumn({ name: 'family_id' })
  family?: BeneficiaryFamily;

  @ManyToOne(() => FamilyMember, (member) => member.callLogs, {
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



// import {
//   Column,
//   CreateDateColumn,
//   DeleteDateColumn,
//   Entity,
//   Index,
//   JoinColumn,
//   ManyToOne,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from 'typeorm';
// import { BeneficiaryFamily } from '../../beneficiary-families/entities/beneficiary-families.entity';
// import { CallStatus } from '../enums/call-status.enum';
// import { FamilyMember } from '../../beneficiary-families/entities/family-members.entity';
// import { Child } from '../../children/entities/children.entity';

// @Entity('call_logs')
// @Index(['familyId'])
// @Index(['familyMemberId'])
// @Index(['callStatus'])
// @Index(['createdAt'])
// export class CallLog {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ name: 'family_id', nullable: true })
//   familyId?: number;

//   @Column({ name: 'family_member_id', nullable: true })
//   familyMemberId?: number;

//   @Column({ name: 'caller_number', length: 20 })
//   callerNumber: string;

//   @Column({ name: 'receiver_number', length: 20 })
//   receiverNumber: string;

//   @Column({
//     name: 'call_status',
//     type: 'enum',
//     enum: CallStatus,
//     nullable: true,
//   })
//   callStatus?: CallStatus;

//   @Column({ type: 'text', nullable: true })
//   notes?: string;

//   @CreateDateColumn({ name: 'created_at' })
//   createdAt: Date;

//   @UpdateDateColumn({ name: 'updated_at' })
//   updatedAt: Date;

//   @DeleteDateColumn({ name: 'deleted_at', nullable: true })
//   deletedAt?: Date;

//   // Relationships

//   @ManyToOne(() => BeneficiaryFamily, (family) => family.callLogs, {
//     onDelete: 'RESTRICT',
//     nullable: true,
//   })
//   @JoinColumn({ name: 'family_id' })
//   family?: BeneficiaryFamily;

//   @ManyToOne(() => FamilyMember, (familyMember) => familyMember.callLogs, {
//     onDelete: 'RESTRICT',
//     nullable: true,
//   })
//   @JoinColumn({ name: 'family_member_id' })
//   familyMember?: FamilyMember;

//   @ManyToOne(() => Child, (child) => child.callLogs, {
//     onDelete: 'RESTRICT',
//     nullable: true,
//   })
//   @JoinColumn({ name: 'child_id' })
//   child?: Child;
// }
