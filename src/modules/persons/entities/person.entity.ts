// person.entity.ts
import { Entity, Column, ManyToOne, Check, JoinColumn, Index, OneToOne, OneToMany } from 'typeorm';
import { DropdownOption } from '../../dropdowns/entities/dropdown-option.entity';
import { CoreEntity } from 'src/shared/modules/app-type-orm/entities/core.entity';
import { GenderType } from '../enums/gender-type.enum';
import { ClothingSize } from '../enums/clothing-size.enum';
import { Guardian } from 'src/modules/guardians/entities/guardian.entity';
import { Child } from 'src/modules/beneficiary-families/entities/children.entity';
import { FamilyMember } from 'src/modules/beneficiary-families/entities/family-members.entity';
import { Employee } from 'src/modules/employees/entities/employee.entity';
@Entity('person')
@Index(['nationalId'], { unique: true, where: 'national_id IS NOT NULL AND deleted_at IS NULL' })
@Index(['email'], { unique: true, where: 'email IS NOT NULL AND deleted_at IS NULL' })
@Index(['firstName', 'lastName'])
@Index(['birthDate'])
@Index(['deletedAt'])
export class Person extends CoreEntity {
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

  @Column({ type: 'boolean', default: false, name: 'is_palestinian' })
  isPalestinian: boolean;

  @Column({ type: 'enum', enum: GenderType, nullable: true, name: 'gender' })
  gender: GenderType;

  @Column({ length: 100, nullable: true })
  nationality: string;

  @Column({ length: 200, nullable: true, name: 'birth_place' })
  birthPlace: string;

  @Column({ type: 'boolean', default: false, name: 'is_working' })
  isWorking: boolean;

  @Column({ length: 200, nullable: true, name: 'current_job' })
  currentJob: string;

  @Column({ type: 'text', nullable: true, name: 'job_details' })
  jobDetails: string;

  @Column({ type: 'boolean', default: false, name: 'is_smoker' })
  isSmoker: boolean;

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

  @ManyToOne(() => Person, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'father_id' })
  father?: Person;

  @ManyToOne(() => Person, { nullable: true, onDelete: 'SET NULL' })
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

  // one to one relations
  @OneToOne(() => Guardian, (guardian) => guardian.person, {
    cascade: true,
    nullable: true,
  })
  guardian?: Guardian;

  @OneToOne(() => Child, (child) => child.person, {
    cascade: true,
    nullable: true,
  })
  child?: Child;

  @OneToOne(() => FamilyMember, (member) => member.person, {
    cascade: true,
    nullable: true,
  })
  familyMember?: FamilyMember;

  @OneToOne(() => Employee, (employee) => employee.person, {
    cascade: true,
    nullable: true,
  })
  employee?: Employee;
}
