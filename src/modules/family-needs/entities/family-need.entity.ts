import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../../shared/modules/app-type-orm/entities/core.entity';
import { BeneficiaryFamily } from '../../beneficiary-families/entities/beneficiary-families.entity';
import { Child } from '../../beneficiary-families/entities/children.entity';
import { PriorityLevel } from '../enums/priority-level.enum';
import { FamilyNeedStatus } from '../enums/family-need-status.enum';

@Entity('family_needs')
@Index(['familyId'])
@Index(['childId'])
@Index(['needType'])
@Index(['priorityLevel'])
@Index(['status'])
@Index(['deletedAt'])
export class FamilyNeed extends CoreEntity {
  @Column({ name: 'family_id' })
  familyId: number;

  @Column({ name: 'child_id', nullable: true })
  childId?: number;

  @Column({ name: 'need_type', length: 100 })
  needType: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'integer', nullable: true })
  quantity?: number;

  @Column({
    name: 'priority_level',
    type: 'enum',
    enum: PriorityLevel,
    default: PriorityLevel.MEDIUM,
  })
  priorityLevel: PriorityLevel;

  @Column({
    name: 'status',
    type: 'enum',
    enum: FamilyNeedStatus,
    default: FamilyNeedStatus.PENDING,
  })
  status: FamilyNeedStatus;

  // Relationships
  @ManyToOne(() => BeneficiaryFamily, (family) => family.needs, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'family_id' })
  family: BeneficiaryFamily;

  @ManyToOne(() => Child, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'child_id' })
  child?: Child;
}
