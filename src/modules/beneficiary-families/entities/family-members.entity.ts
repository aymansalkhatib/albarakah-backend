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
import { FamilyRelationType } from '../enums/family-relation-type.enum';
import { BeneficiaryFamily } from './beneficiary-families.entity';
import { PersonCourseBatch } from '../../training-courses/entities/person-course-batch.entity';

@Entity('family_members')
@Index(['familyId', 'personId', 'relationType'], { unique: true })
@Index(['familyId', 'relationType'])
@Index(['personId'])
@Index(['relationType'])
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

  // Relationships

  @ManyToOne(() => Person, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @ManyToOne(() => BeneficiaryFamily, (family) => family.members, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'family_id' })
  family: BeneficiaryFamily;

  @OneToMany(() => PersonCourseBatch, (courseBatch) => courseBatch.familyMember, {
    cascade: ['insert', 'update'],
  })
  courseBatches: PersonCourseBatch[];

  get isParent(): boolean {
    return [FamilyRelationType.MOTHER, FamilyRelationType.FATHER].includes(this.relationType);
  }

  get isChild(): boolean {
    return [FamilyRelationType.SON, FamilyRelationType.DAUGHTER].includes(this.relationType);
  }
}
