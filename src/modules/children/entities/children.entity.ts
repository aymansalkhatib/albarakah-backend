import { Person } from 'src/modules/persons/entities/person.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReceivedAssistance } from 'src/modules/received-assistance/entities/received-assistance.entity';
import { CallLog } from 'src/modules/call-logs/entities/call-log.entity';
import { BeneficiaryFamily } from 'src/modules/beneficiary-families/entities/beneficiary-families.entity';
import { FamilyMember } from 'src/modules/beneficiary-families/entities/family-members.entity';

@Entity('children')
@Index(['personId'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['familyId', 'isSponsored'])
@Index(['familyMemberId'])
@Index(['isSponsored'])
@Index(['deletedAt'])
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

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

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
  @OneToMany(() => CallLog, (callLog) => callLog.child, {
    cascade: ['insert', 'update'],
  })
  callLogs: CallLog[];

  receivedAssistance: ReceivedAssistance[];
}
