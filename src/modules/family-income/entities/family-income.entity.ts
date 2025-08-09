import { Family } from '../../../modules/families/entities/families.entity';
import { FamilyMember } from '../../../modules/family-members/entities/family-members.entity';
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

  @Column({ name: 'family_member_id', nullable: true })
  familyMemberId?: number;

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

  @ManyToOne(() => FamilyMember, (familyMember) => familyMember.income, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'family_member_id' })
  familyMember?: FamilyMember;
}
