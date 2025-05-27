import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Dropdown } from './dropdown.entity';

@Entity('dropdown_options')
export class DropdownOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'dropdown_id' })
  dropdownId: number;

  @Column({ length: 100 })
  name: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  // Relationships

  @ManyToOne(() => Dropdown, (dropdown) => dropdown.options, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'dropdown_id' })
  dropdown: Dropdown;
}
