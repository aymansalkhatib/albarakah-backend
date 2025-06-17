// person.entity.ts
import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { DropdownOption } from '../../dropdowns/entities/dropdown-option.entity';
import { GenderType } from '../enums/gender-type.enum';
import { ClothingSize } from '../enums/clothing-size.enum';
import { Guardian } from 'src/modules/guardians/entities/guardian.entity';
import { FamilyMember } from 'src/modules/beneficiary-families/entities/family-members.entity';
import { Employee } from 'src/modules/employees/entities/employee.entity';
import { Supporter } from 'src/modules/supporters/entities/supporters.entity';
import { Child } from 'src/modules/children/entities/children.entity';

@Entity('person')
@Index('idx_person_national_id', ['nationalId'], { unique: true, where: 'national_id IS NOT NULL' })
@Index('idx_person_email', ['email'], { unique: true, where: 'email IS NOT NULL' })
@Index('idx_person_father', ['firstName', 'lastName', 'fatherId'], { unique: true })
@Index('idx_person_mother', ['firstName', 'lastName', 'motherId'], { unique: true })
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'father_id', nullable: true })
  fatherId?: number;

  @Column({ name: 'mother_id', nullable: true })
  motherId?: number;

  @Column({ length: 100, name: 'first_name' })
  firstName: string;

  @Column({ length: 100, name: 'last_name' })
  lastName: string;

  @Column({ type: 'date', nullable: true, name: 'birth_date' })
  birthDate: Date;

  @Column({ length: 50, unique: true, nullable: true, name: 'national_id' })
  nationalId: string;

  @Column({ type: 'boolean', name: 'is_palestinian', nullable: true })
  isPalestinian?: boolean;

  @Column({ type: 'enum', enum: GenderType, nullable: true, name: 'gender' })
  gender: GenderType;

  @Column({ length: 100, nullable: true })
  nationality: string;

  @Column({ length: 200, nullable: true, name: 'birth_place' })
  birthPlace: string;

  @Column({ type: 'boolean', name: 'is_working', nullable: true })
  isWorking?: boolean;

  @Column({ length: 200, nullable: true, name: 'current_job' })
  currentJob: string;

  @Column({ type: 'text', nullable: true, name: 'job_details' })
  jobDetails: string;

  @Column({ type: 'boolean', name: 'is_smoker', nullable: true })
  isSmoker?: boolean;

  @Column({ name: 'health_status_id', nullable: true })
  healthStatusId: number;

  @Column({ name: 'education_level_id', nullable: true })
  educationLevelId: number;

  @Column({ name: 'school_type_id', nullable: true })
  schoolTypeId: number;

  @Column({ name: 'person_status_id', nullable: true })
  personStatusId: number;

  @Column({ name: 'marital_status_id', nullable: true })
  maritalStatusId: number;

  @Column({ length: 150, nullable: true, name: 'university_major' })
  universityMajor: string;

  @Column({ length: 255, unique: true, nullable: true })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Check(`"shoe_size" BETWEEN 16 AND 48`)
  @Column({ type: 'int', nullable: true, name: 'shoe_size' })
  shoeSize: number;

  @Column({
    type: 'enum',
    enum: ClothingSize,
    nullable: true,
    name: 'clothing_size',
  })
  clothingSize: ClothingSize;

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Relationships

  @ManyToOne(() => Person, { nullable: true, onDelete: 'SET NULL', cascade: true })
  @JoinColumn({ name: 'father_id' })
  father?: Person;

  @ManyToOne(() => Person, { nullable: true, onDelete: 'SET NULL', cascade: true })
  @JoinColumn({ name: 'mother_id' })
  mother?: Person;

  @ManyToOne(() => DropdownOption, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'education_level_id' })
  educationLevel?: DropdownOption;

  @ManyToOne(() => DropdownOption, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'marital_status_id' })
  maritalStatus?: DropdownOption;

  @ManyToOne(() => DropdownOption, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'person_status_id' })
  personStatus?: DropdownOption;

  @ManyToOne(() => DropdownOption, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'school_type_id' })
  schoolType?: DropdownOption;

  @ManyToOne(() => DropdownOption, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'health_status_id' })
  healthStatus?: DropdownOption;

  // one-to-one relations
  @OneToOne(() => Guardian, (guardian) => guardian.person, {
    nullable: true,
  })
  guardian?: Guardian;

  @OneToOne(() => Child, (child) => child.person, {
    nullable: true,
  })
  child?: Child;

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
