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
import { Family } from './families.entity';
import { PersonCourseBatch } from '../../training-courses/entities/person-course-batch.entity';
import { CallLog } from '@app/modules/call-logs/entities/call-log.entity';

@Entity('family_members')
@Index(['familyId', 'personId', 'relationType'], { unique: true })
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

  @ManyToOne(() => Person, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @ManyToOne(() => Family, (family) => family.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'family_id' })
  family: Family;

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
