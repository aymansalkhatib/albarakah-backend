import { Family } from '@app/modules/families/entities/families.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('family_income')
export class FamilyIncome {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'family_id' })
  familyId: number;

  @Column({ name: 'amount', type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'income_source', length: 100 })
  incomeSource: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Family, (family) => family.income, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'family_id' })
  family: Family;
}
