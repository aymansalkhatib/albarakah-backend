import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { FamilyMember } from './family-members.entity';
import { Max } from 'class-validator';
import { Guardian } from 'src/modules/guardians/entities/guardian.entity';
import { Child } from './children.entity';
import { CoreEntity } from 'src/shared/modules/app-type-orm/entities/core.entity';
import { FamilyNeed } from 'src/modules/family-needs/entities/family-need.entity';
import { EmergencyAidRequest } from 'src/modules/emergency-aid/entities/emergency-aid-request.entity';
import { ReceivedAssistance } from 'src/modules/received-assistance/entities/received-assistance.entity';
import { FamilyIncome } from './family-income.entity';
import { CallLog } from 'src/modules/call-logs/entities/call-log.entity';
@Entity('beneficiary_families')
@Index(['guardianId', 'deletedAt'])
@Index(['familyBookNumber'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['familyName'])
@Index(['registrationDate'])
@Index(['isDisplaced'])
@Index(['isExtremelyPoor'])
@Index(['deletedAt'])
export class BeneficiaryFamily extends CoreEntity {
  @Column({ name: 'guardian_id' })
  guardianId: number;

  @Column({ name: 'family_name', type: 'varchar', length: 64 })
  familyName: string;

  @Column({ name: 'family_book_number', type: 'varchar', length: 20, unique: true })
  familyBookNumber: string;

  @Column({ name: 'landline_phone', type: 'varchar', length: 10, nullable: true })
  landlinePhone?: string;

  @Column({ name: 'mobile_phone', type: 'varchar', length: 10, nullable: true })
  mobilePhone?: string;

  @Column({ name: 'is_displaced', nullable: true })
  isDisplaced?: boolean;

  @Column({ name: 'is_extremely_poor', nullable: true })
  isExtremelyPoor?: boolean;

  @Column({ name: 'voucher_amount', type: 'int', nullable: true })
  @Max(1_000_000_000)
  voucherAmount?: number;

  @Column({ name: 'family_suspension_date', type: 'timestamp', nullable: true })
  familySuspensionDate?: string;

  @Column({ name: 'suspension_reason', type: 'text', nullable: true })
  suspensionReason?: string;

  @Column({ name: 'mother_is_training_beneficiary', nullable: true })
  motherIsTrainingBeneficiary?: boolean;
  @Column({
    name: 'children_school_expenses',
    type: 'int',
  })
  @Max(1_000_000_000)
  childrenSchoolExpenses: number;

  @Column({
    name: 'income_from_baraka_association',
    type: 'int',
  })
  @Max(1_000_000_000)
  incomeFromBarakaAssociation: number;

  @Column({ name: 'registration_date', type: 'date', default: () => 'CURRENT_DATE' })
  registrationDate: string;

  @Column({ name: 'last_assessment_date', type: 'date', nullable: true })
  lastAssessmentDate?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Relationships

  @ManyToOne(() => Guardian, (guardian) => guardian.families, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'guardian_id' })
  guardian: Guardian;

  @OneToMany(() => FamilyMember, (member) => member.family, {
    cascade: ['insert', 'update'],
  })
  members: FamilyMember[];

  @OneToMany(() => Child, (child) => child.family, {
    cascade: ['insert', 'update'],
  })
  children: Child[];

  @OneToMany(() => FamilyNeed, (need) => need.family, {
    cascade: ['insert', 'update'],
  })
  needs: FamilyNeed[];

  @OneToMany(() => ReceivedAssistance, (assistance) => assistance.family, {
    cascade: ['insert', 'update'],
  })
  receivedAssistance: ReceivedAssistance[];

  @OneToMany(() => EmergencyAidRequest, (request) => request.family, {
    cascade: ['insert', 'update'],
  })
  emergencyAidRequests: EmergencyAidRequest[];

  @OneToMany(() => FamilyIncome, (income) => income.family, {
    cascade: ['insert', 'update'],
  })
  income: FamilyIncome[];

  @OneToMany(() => CallLog, (callLog) => callLog.family, {
    cascade: ['insert', 'update'],
  })
  callLogs: CallLog[];

  get sponsoredChildrenCount(): number {
    return this.children?.filter((child) => child.isSponsored).length || 0;
  }
}
