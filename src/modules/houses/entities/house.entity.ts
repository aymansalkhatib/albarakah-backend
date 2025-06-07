import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { CoreEntity } from '../../../shared/modules/app-type-orm/entities/core.entity';
import { BeneficiaryFamily } from '../../beneficiary-families/entities/beneficiary-families.entity';

@Entity('houses')
@Index(['familyId'])
@Index(['isRented'])
export class House extends CoreEntity {
  @Column({ name: 'family_id' })
  familyId: number;

  @Column({ name: 'location_text', type: 'text', nullable: true })
  locationText?: string;

  @Column({ length: 100, nullable: true })
  coordinates?: string;

  @Column({ name: 'is_rented', type: 'boolean', default: false })
  isRented: boolean;

  @Column({ name: 'rent_amount', type: 'integer', nullable: true })
  rentAmount?: number;

  // Relationships

  @OneToOne(() => BeneficiaryFamily, (family) => family.house, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'family_id' })
  family: BeneficiaryFamily;
}
