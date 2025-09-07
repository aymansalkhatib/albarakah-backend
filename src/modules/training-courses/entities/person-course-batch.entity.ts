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
import { FamilyMember } from '../../../modules/family-members/entities/family-members.entity';
import { AttendanceStatus } from '../enums/attendance-status.enum';
import { CourseBatch } from './course-batch.entity';

@Entity('person_course_batches')
@Index(['familyMemberId', 'courseBatchId'], { unique: true })
export class PersonCourseBatch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'family_member_id' })
  familyMemberId: number;

  @Column({ name: 'course_batch_id' })
  courseBatchId: number;

  @Column({
    name: 'attendance_status',
    type: 'enum',
    enum: AttendanceStatus,
    nullable: true,
  })
  attendanceStatus?: AttendanceStatus;

  @Column({ type: 'text', nullable: true })
  evaluation?: string;

  @Column({ name: 'join_date', type: 'date', nullable: true })
  joinDate?: Date;

  @Column({ name: 'drop_out_date', type: 'date', nullable: true })
  dropOutDate?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => FamilyMember, (familyMember) => familyMember.courseBatches, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'family_member_id' })
  familyMember: FamilyMember;

  @ManyToOne(() => CourseBatch, (batch) => batch.participants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_batch_id' })
  courseBatch: CourseBatch;
}
