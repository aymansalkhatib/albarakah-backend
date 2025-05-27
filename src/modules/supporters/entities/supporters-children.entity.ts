import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Supporter } from './supporters.entity';
import { Person } from '../../persons/entities/person.entity';
import { BeneficiaryFamily } from '../../beneficiary-families/entities/beneficiary-families.entity';
import { SponsorshipStatus } from '../enums/sponsorship-status.enum';
import { CoreEntity } from '../../../shared/modules/app-type-orm/entities/core.entity';

@Entity('supporter_child_sponsorships')
@Index(['supporterId', 'personId'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['familyId'])
@Index(['sponsorshipStatus'])
@Index(['sponsorshipStartDate', 'sponsorshipEndDate'])
@Index(['deletedAt'])
export class SupporterChildSponsorship extends CoreEntity {
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

  // Relationships
  @ManyToOne(() => Supporter, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'supporter_id' })
  supporter: Supporter;

  @ManyToOne(() => Person, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @ManyToOne(() => BeneficiaryFamily, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'family_id' })
  family?: BeneficiaryFamily;
}
