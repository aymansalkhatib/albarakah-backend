import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @Column({ name: 'dropdown_category_id' })
  dropdownCategoryId: number;

  @Column({ length: 100, unique: true, name: 'dropdown_name' })
  dropdownName: string;

  @Column({
    type: 'enum',
    enum: DropdownSelectionType,
    default: DropdownSelectionType.SINGLE,
    name: 'selection_type',
  })
  selectionType: DropdownSelectionType;

  @Column({ default: false, name: 'allow_duplicates' })
  allowDuplicates: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => DropdownOption, (option) => option.dropdown)
  options: DropdownOption[];

  // Relationships

  @ManyToOne(() => DropdownCategory, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: ' ' })
  dropdownCategory: DropdownCategory;
}
