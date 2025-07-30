import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { Family } from '../../families/entities/families.entity';

@Entity('interviews')
@Index(['familyId'])
@Index(['interviewerId'])
@Index(['interviewDate'])
export class Interview {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships

  @ManyToOne(() => Family, (family) => family.interviews, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'family_id' })
  family?: Family;

  @ManyToOne(() => Employee, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'interviewer_id' })
  interviewer?: Employee;
}
