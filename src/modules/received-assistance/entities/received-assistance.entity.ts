import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FamilyMember } from '../../.././modules/family-members/entities/family-members.entity';
import { Family } from '../../families/entities/families.entity';
import { AssistanceType } from '../enums/assistance-type.enum';

@Entity('received_assistance')
export class ReceivedAssistance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'family_id' })
  familyId: number;

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
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Family, (family) => family.receivedAssistance, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'family_id' })
  family: Family;

  @ManyToOne(
    () => FamilyMember,
    (familyMember) => familyMember.receivedAssistance,
    {
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  @JoinColumn({ name: 'family_member_id' })
  familyMember?: FamilyMember;
}
