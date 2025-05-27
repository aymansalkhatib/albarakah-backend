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
} from 'typeorm';
import { FamilyMember } from './family-members.entity';
import { BeneficiaryFamily } from './beneficiary-families.entity';

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

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

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
}
