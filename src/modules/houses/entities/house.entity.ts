import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Family } from '../../families/entities/families.entity';

@Entity('houses')
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

  // Relationships

  @ManyToOne(() => Family, (family) => family.houses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'family_id' })
  family: Family;
}
