import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../../shared/modules/app-type-orm/entities/core.entity';
import { BeneficiaryFamily } from '../../beneficiary-families/entities/beneficiary-families.entity';
import { Child } from '../../beneficiary-families/entities/children.entity';
import { AssistanceType } from '../enums/assistance-type.enum';

@Entity('received_assistance')
@Index(['childId'])
@Index(['familyId'])
@Index(['assistanceType'])
@Index(['deliveryDate'])
@Index(['deletedAt'])
export class ReceivedAssistance extends CoreEntity {
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
