import { BeneficiaryFamily } from 'src/modules/beneficiary-families/entities/beneficiary-families.entity';
import { FamilyRelationType } from 'src/modules/beneficiary-families/enums/family-relation-type.enum';
import { Person } from 'src/modules/persons/entities/person.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity('guardians')
@Index(['personId'], { unique: true, where: 'deleted_at IS NULL' })
@Index(['relationType'])
@Index(['guardianshipStartDate'])
@Index(['guardianshipEndDate'])
@Index(['deletedAt'])
export class Guardian {
  @PrimaryGeneratedColumn()
  id: number;

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

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  // Relationships

  @ManyToOne(() => Person, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @OneToMany(() => BeneficiaryFamily, (family) => family.guardian)
  families: BeneficiaryFamily[];
}
