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
import { FamilyRelationType } from '../enums/family-relation-type.enum';
import { BeneficiaryFamily } from './beneficiary-families.entity';

@Entity('family_members')
@Index(['familyId', 'personId', 'relationType'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['familyId', 'relationType'])
@Index(['personId'])
@Index(['relationType'])
@Index(['deletedAt'])
export class FamilyMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'person_id' })
  personId: number;

  @Column({ name: 'family_id' })
  familyId: number;

  @Column({ name: 'relation_type', type: 'enum', enum: FamilyRelationType })
  relationType: FamilyRelationType;

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

  @ManyToOne(() => BeneficiaryFamily, (family) => family.members, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'family_id' })
  family: BeneficiaryFamily;

  get isParent(): boolean {
    return [FamilyRelationType.MOTHER, FamilyRelationType.FATHER].includes(this.relationType);
  }

  get isChild(): boolean {
    return [FamilyRelationType.SON, FamilyRelationType.DAUGHTER].includes(this.relationType);
  }
}
