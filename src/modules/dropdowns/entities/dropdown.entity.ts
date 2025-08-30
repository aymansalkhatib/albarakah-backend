import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DropdownSelectionType } from '../enums/dropdown-selection-type.enum';
import { DropdownOption } from './dropdown-option.entity';

@Entity('dropdown')
export class Dropdown {
  @PrimaryGeneratedColumn()
  id: number;

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
}
