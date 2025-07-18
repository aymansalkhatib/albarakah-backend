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
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('guardians')
@Index(['personId'], { unique: true })
@Index(['relationType'])
@Index(['guardianshipStartDate'])
@Index(['guardianshipEndDate'])
export class Guardian {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'person_id', nullable: true })
  personId?: number;

  @Column({ name: 'relation_type', type: 'enum', enum: FamilyRelationType, nullable: true })
  relationType?: FamilyRelationType;

  @Column({ name: 'guardianship_start_date', type: 'date' })
  guardianshipStartDate: string;

  @Column({ name: 'guardianship_end_date', type: 'date', nullable: true })
  guardianshipEndDate?: string;

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

  @OneToMany(() => BeneficiaryFamily, (family) => family.guardian)
  families: BeneficiaryFamily[];
}
