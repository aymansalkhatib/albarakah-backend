import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Family } from '../../../modules/families/entities/families.entity';
import { Person } from '../../persons/entities/person.entity';
import { SupporterChildSponsorship } from '../../supporters/entities/supporters-children.entity';
import { PersonCourseBatch } from '../../training-courses/entities/person-course-batch.entity';
import { FamilyRelationType } from '../enums/family-relation-type.enum';
import { IsPresent } from '../enums/is-present.enum';
import { IsSponsored } from '../enums/is-sponsored.enum';

@Entity('family_members')
@Index(['familyId', 'personId'], { unique: true })
export class FamilyMember {
  @PrimaryGeneratedColumn()
  id: number;

  // Foreign Keys
  @Column({ name: 'person_id' })
  personId: number;

  @Column({ name: 'family_id' })
  familyId: number;

  // Member Details
  @Column({
    name: 'relation_type',
    type: 'enum',
    enum: FamilyRelationType,
  })
  relationType: FamilyRelationType;

  @Column({
    name: 'is_sponsored',
    type: 'enum',
    enum: IsSponsored,
    default: IsSponsored.NO,
  })
  isSponsored: IsSponsored;

  @Column({ name: 'member_number', type: 'int', nullable: true })
  memberNumber?: number;

  @Column({ name: 'is_present', type: 'enum', enum: IsPresent, nullable: true })
  isPresent?: IsPresent;

  @Column({ name: 'is_guardian', type: 'boolean', default: false })
  isGuardian: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Timestamps
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // === RELATIONSHIPS ===

  @OneToMany(
    () => SupporterChildSponsorship,
    (sponsorship) => sponsorship.familyMember,
  )
  childSponsorships: SupporterChildSponsorship[];

  @ManyToOne(() => Person, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @ManyToOne(() => Family, (family) => family.familyMembers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'family_id' })
  family: Family;

  @OneToMany(() => PersonCourseBatch, (courseBatch) => courseBatch.familyMember)
  courseBatches: PersonCourseBatch[];

  // === COMPUTED PROPERTIES ===
}
