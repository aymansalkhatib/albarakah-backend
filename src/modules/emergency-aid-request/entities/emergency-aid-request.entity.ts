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
import { EmergencyAidRequestStatus } from '../enums/emergency-aid-request-status.enum';

@Entity('emergency_aid_requests')
@Index(['familyId'])
export class EmergencyAidRequest {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Family, (family) => family.emergencyAidRequests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'family_id' })
  family: Family;
}
