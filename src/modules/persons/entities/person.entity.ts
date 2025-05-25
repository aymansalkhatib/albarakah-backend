// person.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Check,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { DropdownOption } from '../../dropdowns/entities/dropdown-option.entity';

export enum GenderType {
  MALE = 'male',
  FEMALE = 'female',
}

export enum ClothingSize {
  XXS = 'XXS',
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
  XXXL = 'XXXL',
  XXXXL = 'XXXXL',
  XXXXXL = 'XXXXXL',
}

@Entity('person')
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ type: 'enum', enum: GenderType, nullable: true })
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

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Person, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'father_id' })
  father?: Person;

  @ManyToOne(() => Person, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'mother_id' })
  mother?: Person;

  @ManyToOne(() => DropdownOption, { nullable: true, onDelete: 'SET NULL', eager: true })
  @JoinColumn({ name: 'education_level_id' })
  educationLevel: DropdownOption;

  @ManyToOne(() => DropdownOption, { nullable: true, onDelete: 'SET NULL', eager: true })
  @JoinColumn({ name: 'marital_status_id' })
  maritalStatus: DropdownOption;

  @ManyToOne(() => DropdownOption, { nullable: true, onDelete: 'SET NULL', eager: true })
  @JoinColumn({ name: 'person_status_id' })
  personStatus: DropdownOption;

  @ManyToOne(() => DropdownOption, { nullable: true, onDelete: 'SET NULL', eager: true })
  @JoinColumn({ name: 'school_type_id' })
  schoolType: DropdownOption;

  @ManyToOne(() => DropdownOption, { nullable: true, onDelete: 'SET NULL', eager: true })
  @JoinColumn({ name: 'health_status_id' })
  healthStatus: DropdownOption;
}
