import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BeneficiaryFamily } from '../../beneficiary-families/entities/beneficiary-families.entity';

@Entity('visits')
@Index(['visitDate'])
@Index(['visitDispatchDate'])
export class Visit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'family_id', nullable: true })
  familyId?: number;

  @Column({ name: 'visit_date', type: 'date' })
  visitDate: Date;

  @Column({ name: 'visit_dispatch_date', type: 'date', nullable: true })
  visitDispatchDate?: Date;

  @Column({ name: 'visit_notes', type: 'text', nullable: true })
  visitNotes?: string;

  @Column({ name: 'family_members_count', type: 'integer', nullable: true })
  familyMembersCount?: number;

  @Column({ name: 'house_residents_count', type: 'integer', nullable: true })
  houseResidentsCount?: number;

  @Column({ name: 'family_health_conditions', type: 'text', nullable: true })
  familyHealthConditions?: string;

  @Column({ name: 'visit_committee_evaluation', type: 'text', nullable: true })
  visitCommitteeEvaluation?: string;

  @Column({ name: 'final_evaluation', type: 'text', nullable: true })
  finalEvaluation?: string;

  @Column({ name: 'visit_committee_members', type: 'text', array: true, nullable: true })
  visitCommitteeMembers?: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  // Relationships

  @ManyToOne(() => BeneficiaryFamily, (family) => family.visits, {
    onDelete: 'RESTRICT',
    nullable: true,
  })
  @JoinColumn({ name: 'family_id' })
  family?: BeneficiaryFamily;
}
