import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { DropdownCategory } from './dropdown-category.entity';
import { DropdownOption } from './dropdown-option.entity';

export enum DropdownSelectionType {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
}

@Entity('dropdown')
export class Dropdown {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DropdownCategory, { nullable: false, onDelete: 'RESTRICT' })
  dropdown_category: DropdownCategory;

  @Column({ length: 100, unique: true })
  dropdown_name: string;

  @Column({ type: 'enum', enum: DropdownSelectionType, default: DropdownSelectionType.SINGLE })
  selection_type: DropdownSelectionType;

  @Column({ default: false })
  allow_duplicates: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => DropdownOption, (option) => option.dropdown)
  options: DropdownOption[];
}
