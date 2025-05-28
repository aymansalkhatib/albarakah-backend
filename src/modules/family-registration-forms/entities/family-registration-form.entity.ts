import { Entity, Column, ManyToOne, JoinColumn, Index, OneToOne } from 'typeorm';
import { CoreEntity } from '../../../shared/modules/app-type-orm/entities/core.entity';
import { Person } from '../../persons/entities/person.entity';
import { BeneficiaryFamily } from '../../beneficiary-families/entities/beneficiary-families.entity';
import { RequestStatus } from '../enums/request-status.enum';

@Entity('family_registration_forms')
@Index(['guardianId'])
@Index(['familyId'])
@Index(['interviewDate'])
@Index(['requestStatus'])
@Index(['emailArrivalDate'])
@Index(['applicationApprovalDate'])
export class FamilyRegistrationForm extends CoreEntity {
  @Column({ name: 'guardian_id' })
  guardianId: number;

  @Column({ name: 'family_id' })
  familyId: number;

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

  // Relationships
  @ManyToOne(() => Person, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'guardian_id' })
  guardian: Person;

  @OneToOne(() => BeneficiaryFamily, (family) => family.registrationForm, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'family_id' })
  family: BeneficiaryFamily;
}
