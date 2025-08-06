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
import { SponsorshipStatus } from '../enums/sponsorship-status.enum';
import { FamilyMember } from '@app/modules/family-members/entities/family-members.entity';

@Entity('supporter_child_sponsorships')
@Index(['supporterId', 'familyMemberId'], {
  unique: true,
  where: `"sponsorship_status" = 'active'`,
})
export class SupporterChildSponsorship {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'supporter_id' })
  supporterId: number;

  @Column({ name: 'family_member_id' })
  familyMemberId: number;

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
  @ManyToOne(() => Supporter, (supporter) => supporter.childSponsorships, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'supporter_id' })
  supporter: Supporter;

  @ManyToOne(() => FamilyMember, (familyMember) => familyMember.childSponsorships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'family_member_id' })
  familyMember: FamilyMember;
}
