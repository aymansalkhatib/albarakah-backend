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
import { AssistanceType } from '../enums/assistance-type.enum';
import { FamilyMember } from '@app/modules/family-members/entities/family-members.entity';

@Entity('received_assistance')
@Index(['childId'])
@Index(['familyId'])
@Index(['assistanceType'])
@Index(['deliveryDate'])
export class ReceivedAssistance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'family_id' })
  familyId: number;

  @Column({ name: 'child_id', nullable: true })
  childId?: number;

  @Column({
    name: 'assistance_type',
    type: 'enum',
    enum: AssistanceType,
    nullable: true,
  })
  assistanceType?: AssistanceType;

  @Column({
    name: 'amount',
    type: 'integer',
    nullable: true,
  })
  amount?: number;

  @Column({ name: 'delivery_date', type: 'date' })
  deliveryDate: Date;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Family, (family) => family.receivedAssistance, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'family_id' })
  family: Family;

  @ManyToOne(() => FamilyMember, (familyMember) => familyMember.receivedAssistance, {
    onDelete: 'RESTRICT',
    nullable: true,
  })
  @JoinColumn({ name: 'family_member_id' })
  familyMember?: FamilyMember;
}
