import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { PersonCourseBatch } from './person-course-batch.entity';
import { TrainingCourse } from './training-course.entity';

@Entity('course_batches')
@Unique(['batchNumber', 'trainingCourseId'])
export class CourseBatch {
  @PrimaryGeneratedColumn()
  id: number;

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
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => TrainingCourse, (course) => course.batches, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'training_course_id' })
  trainingCourse: TrainingCourse;

  @OneToMany(() => PersonCourseBatch, (participant) => participant.courseBatch)
  participants: PersonCourseBatch[];
}
