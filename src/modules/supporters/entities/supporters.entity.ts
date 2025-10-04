import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Person } from '../../persons/entities/person.entity';
import { PaymentCycle } from '../enums/payment-cycle.enum';
import { SponsorshipType } from '../enums/sponsorship-type.enum';
import { SupporterChildSponsorship } from './supporters-children.entity';

@Entity('supporters')
export class Supporter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'person_id', nullable: false })
  personId: number;

  @Column({ length: 500, nullable: true })
  address: string;

  @Column({
    name: 'sponsorship_type',
    type: 'enum',
    enum: SponsorshipType,
    default: SponsorshipType.COMPREHENSIVE,
  })
  sponsorshipType: SponsorshipType;

  @Column({
    name: 'payment_cycle',
    type: 'enum',
    enum: PaymentCycle,
    nullable: true,
  })
  paymentCycle?: PaymentCycle;

  @Column({
    name: 'sponsorship_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  sponsorshipAmount?: number;

  @Column({ name: 'authorized_person_name', length: 300, nullable: true })
  authorizedPersonName?: string;

  @Column({ name: 'authorized_person_phone', length: 15, nullable: true })
  authorizedPersonPhone?: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships

  @OneToMany(
    () => SupporterChildSponsorship,
    (sponsorship) => sponsorship.supporter,
  )
  childSponsorships: SupporterChildSponsorship[];

  @OneToOne(() => Person, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'person_id' })
  person: Person;
}
