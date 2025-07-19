import { BeneficiaryFamily } from '../../beneficiary-families/entities/beneficiary-families.entity';
import { FamilyRelationType } from '../../beneficiary-families/enums/family-relation-type.enum';
import { Person } from '../../persons/entities/person.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('guardians')
@Index(['personId'], { unique: true })
export class Guardian {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'person_id' })
  personId: number;

  @Column({ name: 'relation_type', type: 'enum', enum: FamilyRelationType, nullable: true })
  relationType?: FamilyRelationType;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships

  @OneToOne(() => Person, (person) => person.guardian, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @OneToOne(() => BeneficiaryFamily, (family) => family.guardian)
  family: BeneficiaryFamily;
}
