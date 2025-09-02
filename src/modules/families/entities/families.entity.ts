import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FamilyMember } from '../../../modules/family-members/entities/family-members.entity';
import { EmergencyAidRequest } from '../../emergency-aid-request/entities/emergency-aid-request.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { FamilyNeed } from '../../family-needs/entities/family-need.entity';
import { ReceivedAssistance } from '../../received-assistance/entities/received-assistance.entity';
import { Visit } from '../../visits/entities/visit.entity';
import { ArchiveLocation } from '../enums/archive-location.enum';
import { FormOrganizationStatus } from '../enums/form-organization-status.enum';
import { ManagementDecision } from '../enums/management-decision.enum';
import { SponsorshipStatus } from '../enums/sponsorship-status.enum';

@Entity('families')
@Index(['familyBookNumber'], { unique: true })
@Index(['requestNumber'], { unique: true })
@Index(['formNumber'], { unique: true })
export class Family {
  @PrimaryGeneratedColumn()
  id: number;

  // === BASIC INFORMATION ===
  @Column({ name: 'family_name', type: 'varchar', length: 64 })
  familyName: string;

  @Column({ name: 'is_husband_palestinian', type: 'boolean', default: false })
  isHusbandPalestinian: boolean;

  @Column({ name: 'identity_documents', type: 'text', nullable: true })
  identityDocuments?: string;

  @Column({ name: 'family_book_number', type: 'varchar', length: 12 })
  familyBookNumber: string;

  // === FORM & DECISION ===
  @Column({
    name: 'form_number',
    type: 'varchar',
    length: 64,
    unique: true,
  })
  formNumber: string;

  @Column({
    name: 'form_organization_status',
    type: 'enum',
    enum: FormOrganizationStatus,
    nullable: true,
  })
  formOrganizationStatus: FormOrganizationStatus;

  @Column({
    name: 'management_decision',
    type: 'enum',
    enum: ManagementDecision,
    nullable: true,
  })
  managementDecision?: ManagementDecision;

  @Column({ name: 'form_organizer_notes', type: 'text', nullable: true })
  formOrganizerNotes?: string;

  @Column({
    name: 'archive_location',
    type: 'enum',
    enum: ArchiveLocation,
    nullable: true,
  })
  archiveLocation?: ArchiveLocation;

  // === REQUEST INFO ===
  @Column({
    name: 'request_number',
    type: 'varchar',
    length: 32,
    nullable: true,
  })
  requestNumber?: string;

  @Column({ name: 'email_arrival_date', type: 'date', nullable: true })
  emailArrivalDate?: Date;

  @Column({ name: 'interview_date', type: 'timestamp', nullable: true })
  interviewDate?: Date;

  @Column({ name: 'request_acceptance_date', type: 'date', nullable: true })
  requestAcceptanceDate?: Date;

  @Column({ name: 'request_suspension_date', type: 'date', nullable: true })
  requestSuspensionDate?: Date;

  @Column({
    name: 'request_status',
    type: 'varchar',
    length: 32,
    nullable: true,
  })
  requestStatus?: string;

  @Column({
    name: 'previous_request_status',
    type: 'varchar',
    length: 32,
    nullable: true,
  })
  previousRequestStatus?: string;

  @Column({
    name: 'is_status_updated_at_social_affairs',
    type: 'boolean',
    default: false,
  })
  isStatusUpdatedAtSocialAffairs: boolean;

  // === CONTACT INFORMATION ===
  @Column({
    name: 'landline_phone',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  landlinePhone?: string;

  @Column({
    name: 'mobile_phone',
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  mobilePhone?: string;

  @Column({
    name: 'contacted_by_employee_id',
    nullable: true,
  })
  contactedByEmployeeId?: number;

  // === FLAGS & STATUS ===
  @Column({ name: 'is_refugee', default: false })
  isRefugee: boolean;

  @Column({ name: 'is_extremely_poor', default: false })
  isExtremelyPoor: boolean;

  @Column({
    name: 'is_registered_in_other_orphan_association',
    type: 'boolean',
    nullable: true,
  })
  isRegisteredInOtherOrphanAssociation?: boolean;

  @Column({
    name: 'other_orphan_association_name',
    type: 'varchar',
    length: 128,
    nullable: true,
  })
  otherOrphanAssociationName?: string;

  @Column({
    name: 'sponsorship_status',
    type: 'enum',
    enum: SponsorshipStatus,
    nullable: true,
  })
  sponsorshipStatus?: SponsorshipStatus;

  // === COUNTS & VALUES ===
  @Column({ name: 'beneficiary_family_members_count', type: 'int', default: 0 })
  beneficiaryFamilyMembersCount: number;

  @Column({ name: 'guardian_family_members_count', type: 'int', default: 0 })
  guardianFamilyMembersCount: number;

  @Column({ name: 'shared_meal_members_count', type: 'int', default: 0 })
  sharedMealMembersCount: number;

  @Column({
    name: 'voucher_value',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  voucherValue?: number;

  // === TIMESTAMPS ===
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // === RELATIONSHIPS ===
  @OneToMany(() => FamilyMember, (member) => member.family)
  familyMembers: FamilyMember[];

  @OneToMany(() => FamilyNeed, (need) => need.family)
  needs: FamilyNeed[];

  @OneToMany(() => ReceivedAssistance, (assistance) => assistance.family)
  receivedAssistance: ReceivedAssistance[];

  @OneToMany(() => EmergencyAidRequest, (request) => request.family)
  emergencyAidRequests: EmergencyAidRequest[];

  @OneToMany(() => Visit, (visit) => visit.family)
  visits: Visit[];

  @ManyToOne(() => Employee, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'contacted_by_employee_id' })
  contactedByEmployee?: Employee;
}
