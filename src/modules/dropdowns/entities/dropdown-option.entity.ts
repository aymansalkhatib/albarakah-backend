import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Dropdown } from './dropdown.entity';

@Entity('dropdown_options')
export class DropdownOption {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Dropdown, (dropdown) => dropdown.options, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  dropdown: Dropdown;

  @Column({ length: 100 })
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
