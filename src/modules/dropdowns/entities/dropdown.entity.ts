import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { DropdownCategory } from './dropdown-category.entity';
import { DropdownOption } from './dropdown-option.entity';
import { DropdownSelectionType } from '../enums/dropdown-selection-type.enum';

@Entity('dropdown')
@Unique('UQ_dropdown_name_category_id', ['dropdownName', 'dropdownCategoryId'])
export class Dropdown {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'dropdown_category_id' })
  dropdownCategoryId: number;

  @Column({ length: 100, name: 'dropdown_name' })
  dropdownName: string;

  @Column({
    type: 'enum',
    enum: DropdownSelectionType,
    name: 'selection_type',
  })
  selectionType: DropdownSelectionType;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => DropdownOption, (option) => option.dropdown)
  options: DropdownOption[];

  // Relationships

  @ManyToOne(() => DropdownCategory, (category) => category.dropdowns, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'dropdown_category_id' })
  dropdownCategory: DropdownCategory;
}
