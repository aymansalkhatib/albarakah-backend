import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Dropdown } from './dropdown.entity';
import { DropdownSelection } from './dropdown-selection.entity';

@Entity('dropdown_options')
@Unique('UQ_dropdown_option_name_dropdown', ['name', 'dropdownId'])
export class DropdownOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'dropdown_id' })
  dropdownId: number;

  @Column({ length: 100 })
  name: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Relationships

  @ManyToOne(() => Dropdown, (dropdown) => dropdown.options, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'dropdown_id' })
  dropdown: Dropdown;

  @OneToMany(() => DropdownSelection, (selection) => selection.selectedOption)
  selections: DropdownSelection[];
}
