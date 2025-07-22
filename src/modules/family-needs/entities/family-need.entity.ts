import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Family } from '../../families/entities/families.entity';
import { PriorityLevel } from '../enums/priority-level.enum';
import { FamilyNeedStatus } from '../enums/family-need-status.enum';
import { Child } from '../../children/entities/children.entity';

@Entity('family_needs')
@Index(['familyId'])
@Index(['childId'])
@Index(['needType'])
@Index(['priorityLevel'])
@Index(['status'])
export class FamilyNeed {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Family, (family) => family.needs, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'family_id' })
  family: Family;

  @ManyToOne(() => Child, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'child_id' })
  child?: Child;
}
