import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DropdownOption } from './dropdown-option.entity';
import { Dropdown } from './dropdown.entity';
import { DropdownCategory } from './dropdown-category.entity';

@Entity('dropdown_selections')
export class DropdownSelection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'record_id' })
  recordId: number;

  @Column({ length: 50, name: 'record_type' })
  recordType: string;

  @Column({ name: 'dropdown_category_id', nullable: true })
  dropdownCategoryId?: number;

  @Column({ name: 'dropdown_id', nullable: true })
  dropdownId?: number;

  @Column({ name: 'selected_option_id', nullable: true })
  selectedOptionId?: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  // Relationships

  @ManyToOne(() => DropdownCategory, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'dropdown_category_id' })
  dropdownCategory?: DropdownCategory;

  @ManyToOne(() => Dropdown, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'dropdown_id' })
  dropdown?: Dropdown;

  @ManyToOne(() => DropdownOption, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'selected_option_id' })
  selectedOption?: DropdownOption;
}
