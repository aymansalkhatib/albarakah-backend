import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BeneficiaryFamily } from '../../beneficiary-families/entities/beneficiary-families.entity';

@Entity('houses')
@Index(['familyId'])
@Index(['isRented'])
export class House {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
  // Relationships

  @OneToOne(() => BeneficiaryFamily, (family) => family.house, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'family_id' })
  family: BeneficiaryFamily;
}
