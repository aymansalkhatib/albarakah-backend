import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FamilyMember } from './family-members.entity';
import { Max } from 'class-validator';
import { FamilyNeed } from 'src/modules/family-needs/entities/family-need.entity';
import { Guardian } from '../../guardians/entities/guardian.entity';
import { EmergencyAidRequest } from 'src/modules/emergency-aid/entities/emergency-aid-request.entity';
import { ReceivedAssistance } from 'src/modules/received-assistance/entities/received-assistance.entity';
import { FamilyIncome } from './family-income.entity';
import { CallLog } from 'src/modules/call-logs/entities/call-log.entity';
import { House } from 'src/modules/houses/entities/house.entity';
import { Interview } from '../../interviews/entities/interview.entity';
import { FamilyRegistrationForm } from '../../family-registration-forms/entities/family-registration-form.entity';
import { Visit } from 'src/modules/visits/entities/visit.entity';
import { Child } from 'src/modules/children/entities/children.entity';

@Index(['familyBookNumber'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['familyName'])
@Index(['registrationDate'])
@Index(['isDisplaced'])
@Index(['isExtremelyPoor'])
@Index(['deletedAt'])
@Entity('beneficiary_families')
export class BeneficiaryFamily {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  // Relationships

  @ManyToOne(() => Guardian, (guardian) => guardian.families, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'guardian_id' })
  guardian: Guardian;

  @OneToMany(() => FamilyMember, (member) => member.family)
  members: FamilyMember[];

  @OneToMany(() => Child, (child) => child.family)
  children: Child[];

  @OneToMany(() => FamilyNeed, (need) => need.family)
  needs: FamilyNeed[];

  @OneToMany(() => ReceivedAssistance, (assistance) => assistance.family)
  receivedAssistance: ReceivedAssistance[];

  @OneToMany(() => EmergencyAidRequest, (request) => request.family)
  emergencyAidRequests: EmergencyAidRequest[];

  @OneToMany(() => FamilyIncome, (income) => income.family)
  income: FamilyIncome[];

  @OneToMany(() => CallLog, (callLog) => callLog.family)
  callLogs: CallLog[];

  @OneToOne(() => House, (house) => house.family, {
    cascade: ['insert', 'update'],
    nullable: true,
  })
  @JoinColumn({ name: 'house_id' })
  house?: House;

  @OneToMany(() => Interview, (interview) => interview.family)
  interviews: Interview[];

  @OneToOne(() => FamilyRegistrationForm, (form) => form.family)
  registrationForm: FamilyRegistrationForm;

  @OneToMany(() => Visit, (visit) => visit.family)
  visits: Visit[];

  // getters

  get sponsoredChildrenCount(): number {
    return this.children?.filter((child) => child.isSponsored).length || 0;
  }
}
