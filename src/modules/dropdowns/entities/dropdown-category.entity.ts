import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('dropdown_category')
export class DropdownCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'parent_id', nullable: true })
  parentId?: number;

  @OneToMany(() => DropdownCategory, (category) => category.parent)
  children: DropdownCategory[];

  @Column({ length: 200 })
  name: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => DropdownCategory, (category) => category.children, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: DropdownCategory;
}
