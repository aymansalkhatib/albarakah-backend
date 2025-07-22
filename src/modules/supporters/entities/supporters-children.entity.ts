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
import { Supporter } from './supporters.entity';
import { Person } from '../../persons/entities/person.entity';
import { Family } from '../../families/entities/families.entity';
import { SponsorshipStatus } from '../enums/sponsorship-status.enum';

@Entity('supporter_child_sponsorships')
@Index(['supporterId', 'personId'], { unique: true })
@Index(['familyId'])
@Index(['sponsorshipStatus'])
@Index(['sponsorshipStartDate', 'sponsorshipEndDate'])
export class SupporterChildSponsorship {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'supporter_id' })
  supporterId: number;

  @Column({ name: 'person_id' })
  personId: number;

  @Column({ name: 'family_id', nullable: true })
  familyId?: number;

  @Column({
    name: 'sponsorship_amount',
    type: 'integer',
    nullable: true,
  })
  sponsorshipAmount?: number;

  @Column({ name: 'sponsorship_start_date', type: 'date' })
  sponsorshipStartDate: Date;

  @Column({ name: 'sponsorship_end_date', type: 'date', nullable: true })
  sponsorshipEndDate?: Date;

  @Column({
    name: 'sponsorship_status',
    type: 'enum',
    enum: SponsorshipStatus,
    default: SponsorshipStatus.ACTIVE,
  })
  sponsorshipStatus: SponsorshipStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Supporter, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'supporter_id' })
  supporter: Supporter;

  @ManyToOne(() => Person, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @ManyToOne(() => Family, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'family_id' })
  family?: Family;
}
