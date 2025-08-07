import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Max } from 'class-validator';
import { FamilyNeed } from '../../family-needs/entities/family-need.entity';
import { Guardian } from '../../guardians/entities/guardian.entity';
import { EmergencyAidRequest } from '../../emergency-aid-request/entities/emergency-aid-request.entity';
import { ReceivedAssistance } from '../../received-assistance/entities/received-assistance.entity';
import { House } from '../../houses/entities/house.entity';
import { Interview } from '../../interviews/entities/interview.entity';
import { FamilyRegistrationForm } from '../../family-registration-forms/entities/family-registration-form.entity';
import { Visit } from '../../visits/entities/visit.entity';
import { FamilyIncome } from '@app/modules/family-income/entities/family-income.entity';
import { FamilyMember } from '@app/modules/family-members/entities/family-members.entity';

@Entity('families')
@Index(['familyBookNumber'], { unique: true })
export class Family {
  @PrimaryGeneratedColumn()
  id: number;

  // Basic Information
  @Column({ name: 'family_name', type: 'varchar', length: 64 })
  familyName: string;

  @Column({ name: 'family_book_number', type: 'varchar', length: 20, unique: true })
  familyBookNumber: string;

  @Column({ name: 'registration_date', type: 'timestamp' })
  registrationDate: Date;

  // Contact Information
  @Column({ name: 'landline_phone', type: 'varchar', length: 10, nullable: true })
  landlinePhone?: string;

  // Status Flags
  @Column({ name: 'is_displaced', default: false })
  isDisplaced: boolean;

  @Column({ name: 'is_extremely_poor', default: false })
  isExtremelyPoor: boolean;

  @Column({ name: 'mother_is_training_beneficiary', default: false })
  motherIsTrainingBeneficiary: boolean;

  // Financial Information
  @Column({ name: 'voucher_amount', type: 'int', nullable: true })
  @Max(1_000_000_000)
  voucherAmount?: number;

  @Column({ name: 'children_school_expenses', type: 'int', default: 0 })
  @Max(1_000_000_000)
  childrenSchoolExpenses: number;

  @Column({ name: 'income_from_baraka_association', type: 'int', default: 0 })
  @Max(1_000_000_000)
  incomeFromBarakaAssociation: number;

  // Suspension Information
  @Column({ name: 'family_suspension_date', type: 'timestamp', nullable: true })
  familySuspensionDate?: Date;

  @Column({ name: 'suspension_reason', type: 'text', nullable: true })
  suspensionReason?: string;

  // Assessment
  @Column({ name: 'last_assessment_date', type: 'date', nullable: true })
  lastAssessmentDate?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Timestamps
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // === RELATIONSHIPS ===

  // One-to-One Relationships
  @OneToOne(() => Guardian, (guardian) => guardian.family)
  @JoinColumn({ name: 'guardian_id' })
  guardian?: Guardian;

  @OneToMany(() => House, (house) => house.family)
  houses: House[];

  @OneToOne(() => FamilyRegistrationForm, (form) => form.family, {
    onDelete: 'CASCADE',
  })
  registrationForm?: FamilyRegistrationForm;

  // One-to-Many Relationships
  @OneToMany(() => FamilyMember, (member) => member.family)
  members: FamilyMember[];

  @OneToMany(() => FamilyNeed, (need) => need.family)
  needs: FamilyNeed[];

  @OneToMany(() => FamilyIncome, (income) => income.family)
  income: FamilyIncome[];

  @OneToMany(() => ReceivedAssistance, (assistance) => assistance.family)
  receivedAssistance: ReceivedAssistance[];

  @OneToMany(() => EmergencyAidRequest, (request) => request.family)
  emergencyAidRequests: EmergencyAidRequest[];

  @OneToMany(() => Interview, (interview) => interview.family)
  interviews: Interview[];

  @OneToMany(() => Visit, (visit) => visit.family)
  visits: Visit[];
}
