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
import { AssistanceType } from '../enums/assistance-type.enum';
import { Child } from '../../children/entities/children.entity';

@Entity('received_assistance')
@Index(['childId'])
@Index(['familyId'])
@Index(['assistanceType'])
@Index(['deliveryDate'])
@Index(['deletedAt'])
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

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  // Relationships
  @ManyToOne(() => BeneficiaryFamily, (family) => family.receivedAssistance, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'family_id' })
  family: BeneficiaryFamily;

  @ManyToOne(() => Child, (child) => child.receivedAssistance, {
    onDelete: 'RESTRICT',
    nullable: true,
  })
  @JoinColumn({ name: 'child_id' })
  child?: Child;
}
