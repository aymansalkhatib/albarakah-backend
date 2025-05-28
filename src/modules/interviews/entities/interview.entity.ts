import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { CoreEntity } from '../../../shared/modules/app-type-orm/entities/core.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { BeneficiaryFamily } from '../../beneficiary-families/entities/beneficiary-families.entity';
import { Person } from '../../persons/entities/person.entity';

@Entity('interviews')
@Index(['employeesId'])
@Index(['familyId'])
@Index(['interviewerId'])
@Index(['interviewDate'])
export class Interview extends CoreEntity {
  @Column({ name: 'family_id', nullable: true })
  familyId?: number;

  @Column({ name: 'interviewer_id', nullable: true })
  interviewerId?: number;

  @Column({ name: 'interview_date', type: 'date' })
  interviewDate: Date;

  @Column({ length: 255, nullable: true })
  purpose?: string;

  @Column({ type: 'text', nullable: true })
  summary?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Relationships

  @ManyToOne(() => BeneficiaryFamily, (family) => family.interviews, {
    onDelete: 'RESTRICT',
    nullable: true,
  })
  @JoinColumn({ name: 'family_id' })
  family?: BeneficiaryFamily;

  @ManyToOne(() => Employee, {
    onDelete: 'RESTRICT',
    nullable: true,
  })
  @JoinColumn({ name: 'interviewer_id' })
  interviewer?: Employee;
}
