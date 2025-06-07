import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../../shared/modules/app-type-orm/entities/core.entity';
import { FamilyMember } from '../../beneficiary-families/entities/family-members.entity';
import { CourseBatch } from './course-batch.entity';
import { AttendanceStatus } from '../enums/attendance-status.enum';

@Entity('person_course_batches')
@Index(['familyMemberId'])
@Index(['courseBatchId'])
@Index(['attendanceStatus'])
@Index(['joinDate'])
export class PersonCourseBatch extends CoreEntity {
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

  // Relationships
  @ManyToOne(() => FamilyMember, (familyMember) => familyMember.courseBatches, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'family_member_id' })
  familyMember: FamilyMember;

  @ManyToOne(() => CourseBatch, (batch) => batch.participants, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'course_batch_id' })
  courseBatch: CourseBatch;
}
