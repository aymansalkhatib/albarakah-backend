import { Person } from 'src/modules/persons/entities/person.entity';
import {
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { FamilyMember } from './family-members.entity';
import { BeneficiaryFamily } from './beneficiary-families.entity';
import { CoreEntity } from 'src/shared/modules/app-type-orm/entities/core.entity';
import { ReceivedAssistance } from 'src/modules/received-assistance/entities/received-assistance.entity';
import { CallLog } from 'src/modules/call-logs/entities/call-log.entity';
@Entity('children')
@Index(['personId'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['familyId', 'isSponsored'])
@Index(['familyMemberId'])
@Index(['isSponsored'])
@Index(['deletedAt'])
export class Child extends CoreEntity {
  @Column({ name: 'person_id' })
  personId: number;

  @Column({ name: 'family_member_id' })
  familyMemberId: number;

  @Column({ name: 'is_sponsored', default: false })
  isSponsored: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Relationships

  @ManyToOne(() => Person, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @ManyToOne(() => FamilyMember, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'family_member_id' })
  familyMember: FamilyMember;

  @ManyToOne(() => BeneficiaryFamily, (family) => family.children, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'family_id' })
  family: BeneficiaryFamily;

  @OneToMany(() => ReceivedAssistance, (assistance) => assistance.child, {
    cascade: ['insert', 'update'],
  })
  receivedAssistance: ReceivedAssistance[];
}
