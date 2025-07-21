import { Person } from '../../persons/entities/person.entity';
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
import { ReceivedAssistance } from '../../received-assistance/entities/received-assistance.entity';
import { BeneficiaryFamily } from '../../beneficiary-families/entities/beneficiary-families.entity';
import { FamilyMember } from '../../beneficiary-families/entities/family-members.entity';
import { CallLog } from '@app/modules/call-logs/entities/call-log.entity';

@Entity('children')
@Index(['personId'], { unique: true })
@Index(['familyId', 'isSponsored'])
@Index(['familyMemberId'])
@Index(['isSponsored'])
export class Child {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'person_id' })
  personId: number;

  @Column({ name: 'family_member_id' })
  familyMemberId: number;

  @Column({ name: 'family_id' })
  familyId: number;

  @Column({ name: 'is_sponsored', default: false })
  isSponsored: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships

  @ManyToOne(() => Person, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @ManyToOne(() => FamilyMember, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'family_member_id' })
  familyMember: FamilyMember;

  @ManyToOne(() => BeneficiaryFamily, (family) => family.children, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'family_id' })
  family: BeneficiaryFamily;

  @OneToMany(() => ReceivedAssistance, (assistance) => assistance.child, {
    cascade: ['insert', 'update'],
  })
  receivedAssistance: ReceivedAssistance[];
}
