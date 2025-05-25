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

  @Column({ length: 100 })
  first_name: string;

  @Column({ length: 100 })
  last_name: string;

  @ManyToOne(() => Person, { nullable: true, onDelete: 'SET NULL' })
  father: Person;

  @ManyToOne(() => Person, { nullable: true, onDelete: 'SET NULL' })
  mother: Person;

  @Column({ type: 'date', nullable: true })
  birth_date: Date;

  @Column({ length: 50, unique: true, nullable: true })
  national_id: string;

  @Column({ type: 'boolean', default: false })
  is_palestinian: boolean;

  @Column({ type: 'enum', enum: GenderType, nullable: true })
  gender: GenderType;

  @Column({ length: 100, nullable: true })
  nationality: string;

  @Column({ length: 200, nullable: true })
  birth_place: string;

  @Column({ type: 'boolean', default: false })
  is_employed: boolean;

  @Column({ length: 200, nullable: true })
  current_job: string;

  @Column({ type: 'text', nullable: true })
  job_details: string;

  @Column({ type: 'boolean', default: false })
  is_smoker: boolean;

  @ManyToOne(() => DropdownOption, { nullable: true, onDelete: 'SET NULL', eager: true })
  @JoinColumn({ name: 'health_status_id' })
  health_status: DropdownOption;

  @ManyToOne(() => DropdownOption, { nullable: true, onDelete: 'SET NULL', eager: true })
  @JoinColumn({ name: 'education_level_id' })
  education_level: DropdownOption;

  @ManyToOne(() => DropdownOption, { nullable: true, onDelete: 'SET NULL', eager: true })
  @JoinColumn({ name: 'school_type_id' })
  school_type: DropdownOption;

  @ManyToOne(() => DropdownOption, { nullable: true, onDelete: 'SET NULL', eager: true })
  @JoinColumn({ name: 'person_status_id' })
  person_status: DropdownOption;

  @ManyToOne(() => DropdownOption, { nullable: true, onDelete: 'SET NULL', eager: true })
  @JoinColumn({ name: 'marital_status_id' })
  marital_status: DropdownOption;

  @Column({ length: 150, nullable: true })
  university_major: string;

  @Column({ length: 255, unique: true, nullable: true })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Check(`"shoe_size" BETWEEN 16 AND 48`)
  @Column({ type: 'int', nullable: true })
  shoe_size: number;

  @Column({
    type: 'enum',
    enum: ClothingSize,
    nullable: true,
  })
  clothing_size: ClothingSize;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
