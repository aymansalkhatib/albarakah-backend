import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { CoreEntity } from '../../../shared/modules/app-type-orm/entities/core.entity';
import { BeneficiaryFamily } from '../../beneficiary-families/entities/beneficiary-families.entity';
import { EmergencyAidRequestStatus } from '../enums/emergency-aid-request-status.enum';

@Entity('emergency_financial_aid')
@Index(['familyId'])
@Index(['requestStatus'])
@Index(['requestDate'])
@Index(['disbursementDate'])
@Index(['deletedAt'])
export class EmergencyFinancialAid extends CoreEntity {
  @Column({ name: 'family_id' })
  familyId: number;

  @Column({
    name: 'request_status',
    type: 'enum',
    enum: EmergencyAidRequestStatus,
    default: EmergencyAidRequestStatus.PENDING,
  })
  requestStatus: EmergencyAidRequestStatus;

  @Column({
    name: 'requested_amount',
    type: 'integer',
    nullable: false,
  })
  requestedAmount: number;

  @Column({
    name: 'disbursed_amount',
    type: 'integer',
    nullable: true,
  })
  disbursedAmount?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({
    name: 'request_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  requestDate: Date;

  @Column({
    name: 'disbursement_date',
    type: 'timestamp',
    nullable: true,
  })
  disbursementDate?: Date;

  // Relationships
  @ManyToOne(() => BeneficiaryFamily, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'family_id' })
  family: BeneficiaryFamily;
}
