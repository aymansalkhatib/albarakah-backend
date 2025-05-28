import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { CoreEntity } from '../../../shared/modules/app-type-orm/entities/core.entity';
import { BeneficiaryFamily } from './beneficiary-families.entity';

@Entity('family_income')
@Index(['familyId'])
@Index(['incomeSource'])
@Index(['createdAt'])
export class FamilyIncome extends CoreEntity {
  @Column({ name: 'family_id' })
  familyId: number;

  @Column({ name: 'amount', type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'income_source', length: 100 })
  incomeSource: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Relationships
  @ManyToOne(() => BeneficiaryFamily, (family) => family.income, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'family_id' })
  family: BeneficiaryFamily;
} 