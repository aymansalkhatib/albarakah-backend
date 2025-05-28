import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { CoreEntity } from '../../../shared/modules/app-type-orm/entities/core.entity';
import { TrainingCourse } from './training-course.entity';

@Entity('course_batches')
@Index(['trainingCourseId'])
@Index(['batchNumber'])
@Index(['startDate'])
@Index(['endDate'])
export class CourseBatch extends CoreEntity {
  @Column({ name: 'training_course_id' })
  trainingCourseId: number;

  @Column({ name: 'batch_number' })
  batchNumber: number;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate?: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate?: Date;

  @Column({ length: 255, nullable: true })
  location?: string;

  @Column({ type: 'text', nullable: true })
  note?: string;

  // Relationships
  @ManyToOne(() => TrainingCourse, (course) => course.batches, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'training_course_id' })
  trainingCourse: TrainingCourse;
}
