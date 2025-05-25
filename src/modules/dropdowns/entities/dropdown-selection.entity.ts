import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { DropdownOption } from './dropdown-option.entity';
import { Dropdown } from './dropdown.entity';
import { DropdownCategory } from './dropdown-category.entity';

@Entity('dropdown_selections')
export class DropdownSelection {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DropdownOption, { nullable: false, onDelete: 'RESTRICT' })
  selected_value: DropdownOption;

  @ManyToOne(() => Dropdown, { nullable: false, onDelete: 'RESTRICT' })
  dropdown: Dropdown;

  @ManyToOne(() => DropdownCategory, { nullable: false, onDelete: 'RESTRICT' })
  dropdown_category: DropdownCategory;

  @Column()
  record_id: number;

  @Column({ length: 50 })
  record_type: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
