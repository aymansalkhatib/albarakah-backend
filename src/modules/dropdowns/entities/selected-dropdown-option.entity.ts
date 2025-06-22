import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DropdownOption } from './dropdown-option.entity';
import { Dropdown } from './dropdown.entity';
import { DropdownCategory } from './dropdown-category.entity';
import { RecordType } from '../enums/recored-type.enums';

@Entity('selected_dropdown_options')
export class SelectedDropdownOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'record_id' })
  recordId: number;

  @Column({ type: 'enum', enum: RecordType, name: 'record_type' })
  recordType: RecordType;

  @Column({ name: 'dropdown_id' })
  dropdownId: number;

  @Column({ name: 'category_id' })
  categoryId: number;

  @Column({ name: 'selected_option_id' })
  selectedOptionId: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  // Relationships

  @ManyToOne(() => Dropdown, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dropdown_id' })
  dropdown: Dropdown;

  @ManyToOne(() => DropdownCategory, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: DropdownCategory;

  @ManyToOne(() => DropdownOption, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'selected_option_id' })
  selectedOption: DropdownOption;
}
