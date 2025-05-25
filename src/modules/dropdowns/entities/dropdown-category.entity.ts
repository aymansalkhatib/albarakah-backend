import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('dropdown_category')
export class DropdownCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DropdownCategory, (category) => category.children, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  parent?: DropdownCategory;

  @OneToMany(() => DropdownCategory, (category) => category.parent)
  children: DropdownCategory[];

  @Column({ length: 200 })
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
