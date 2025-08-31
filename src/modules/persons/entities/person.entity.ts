import {
  Column,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FamilyMember } from '../../../modules/family-members/entities/family-members.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { Supporter } from '../../supporters/entities/supporters.entity';
import { CurrentStudyStatus } from '../enums/current-study-status.enum';
import { EducationLevel } from '../enums/education-level.enum';
import { GenderType } from '../enums/gender-type.enum';
import { MaritalStatus } from '../enums/marital-status.enum';
import { SchoolType } from '../enums/school-type.enum';
import { SuccessCertificateSubmission } from '../enums/success-certificate-submission-2023-2024.enum';

@Entity('person')
@Index('idx_person_national_id', ['nationalId'], {
  unique: true,
  where: 'national_id IS NOT NULL',
})
@Index('idx_person_full_name', ['fullName'], {
  unique: true,
})
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'full_name', length: 300 })
  fullName: string;

  @Column({ name: 'mother_name', length: 100, nullable: true })
  motherName?: string;

  @Column({ type: 'date', nullable: true, name: 'birth_date' })
  birthDate: Date;

  @Column({ length: 200, nullable: true, name: 'birth_place' })
  birthPlace: string;

  @Column({ length: 50, unique: true, nullable: true, name: 'national_id' })
  nationalId: string;

  @Column({ length: 100, nullable: true })
  nationality: string;

  @Column({ length: 100, nullable: true, name: 'mother_nationality' })
  motherNationality?: string;

  @Column({ type: 'boolean', name: 'is_palestinian', nullable: true })
  isPalestinian?: boolean;

  @Column({ type: 'enum', enum: GenderType, nullable: true, name: 'gender' })
  gender: GenderType;

  @Column({ type: 'int', nullable: true, name: 'shoe_size' })
  shoeSize: number;

  @Column({
    name: 'marital_status',
    type: 'enum',
    nullable: true,
    enum: MaritalStatus,
  })
  maritalStatus: MaritalStatus;

  @Column({ type: 'boolean', name: 'is_working', nullable: true })
  isWorking?: boolean;

  @Column({ length: 200, nullable: true, name: 'current_job' })
  currentJob: string;

  @Column({ type: 'text', nullable: true, name: 'job_details' })
  jobDetails: string;

  @Column({ type: 'boolean', name: 'is_smoker', nullable: true })
  isSmoker?: boolean;

  @Column({ name: 'health_status', nullable: true })
  healthStatus: string;

  @Column({ name: 'is_health_insurance_used', nullable: true })
  isHealthInsuranceUsed: boolean;

  @Column({
    name: 'success_certificate_submission',
    default: SuccessCertificateSubmission.No,
    type: 'enum',
    enum: SuccessCertificateSubmission,
  })
  isSuccessCertificateSubmitted: SuccessCertificateSubmission;

  @Column({
    name: 'education_level',
    nullable: true,
    type: 'enum',
    enum: EducationLevel,
  })
  educationLevel: EducationLevel;

  @Column({ length: 150, nullable: true, name: 'university_major' })
  universityMajor: string;

  @Column({
    name: 'current_study_status',
    nullable: true,
    type: 'enum',
    enum: CurrentStudyStatus,
  })
  currentStudyStatus: CurrentStudyStatus;

  @Column({
    name: 'school_type',
    nullable: true,
    type: 'enum',
    enum: SchoolType,
  })
  schoolType: SchoolType;

  @Column({ length: 200, nullable: true, name: 'school_name' })
  schoolName: string;

  @Column({ length: 15, nullable: true })
  mobilePhone: string;

  @Column({ length: 15, nullable: true })
  landlinePhone: string;

  @Column({ length: 15, nullable: true })
  whatsappNumber: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Relationships

  @OneToOne(() => FamilyMember, (member) => member.person, {
    nullable: true,
  })
  familyMember?: FamilyMember;

  @OneToOne(() => Employee, (employee) => employee.person, {
    nullable: true,
  })
  employee?: Employee;

  @OneToOne(() => Supporter, (supporter) => supporter.person, {
    nullable: true,
  })
  supporter?: Supporter;
}
