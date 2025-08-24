import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Family } from '../../families/entities/families.entity';
import { RequestStatus } from '../enums/request-status.enum';

@Entity('family_registration_forms')
export class FamilyRegistrationForm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'mother_agrees_training', type: 'boolean', nullable: true })
  motherAgreesTraining?: boolean;

  @Column({ name: 'is_form_organized', type: 'boolean', nullable: true })
  isFormOrganized?: boolean;

  @Column({ name: 'interview_date', type: 'date', nullable: true })
  interviewDate?: Date;

  @Column({ name: 'form_notes', type: 'text', nullable: true })
  formNotes?: string;

  @Column({ name: 'management_decision', type: 'text', nullable: true })
  managementDecision?: string;

  @Column({ name: 'archive_location', length: 255, nullable: true })
  archiveLocation?: string;

  @Column({ name: 'family_verification_documents', type: 'text', nullable: true })
  familyVerificationDocuments?: string;

  @Column({ name: 'registered_in_other_charity', type: 'boolean', nullable: true })
  registeredInOtherCharity?: boolean;

  @Column({ name: 'email_arrival_date', type: 'date', nullable: true })
  emailArrivalDate?: Date;

  @Column({ name: 'application_approval_date', type: 'date', nullable: true })
  applicationApprovalDate?: Date;

  @Column({
    name: 'request_status',
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.PENDING,
  })
  requestStatus: RequestStatus;

  @Column({ name: 'previous_request_status', length: 50, nullable: true })
  previousRequestStatus?: string;

  @Column({ name: 'updated_in_social_affairs', type: 'boolean', nullable: true })
  updatedInSocialAffairs?: boolean;

  @Column({ name: 'mealtime_participants', type: 'integer', nullable: true })
  mealtimeParticipants?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships

  // One-to-One Relationships
  @OneToOne(() => Family, (family) => family.registrationForm, { nullable: false })
  family: Family;
}
