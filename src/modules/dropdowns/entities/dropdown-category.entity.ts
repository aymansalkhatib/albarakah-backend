import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('dropdown_category')
export class DropdownCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'parent_id', nullable: true })
  parentId?: number;

  @Column({ length: 200 })
  name: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  // Relationships

  @OneToMany(() => DropdownCategory, (category) => category.parent)
  children: DropdownCategory[];

  @ManyToOne(() => DropdownCategory, (category) => category.children, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: DropdownCategory;
}
