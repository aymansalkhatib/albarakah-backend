import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TrainingCourse } from './training-course.entity';
import { PersonCourseBatch } from './person-course-batch.entity';

@Entity('course_batches')
@Index(['trainingCourseId'])
@Index(['batchNumber'])
@Index(['startDate'])
@Index(['endDate'])
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
  note?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  // Relationships
  @ManyToOne(() => TrainingCourse, (course) => course.batches, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'training_course_id' })
  trainingCourse: TrainingCourse;

  @OneToMany(() => PersonCourseBatch, (participant) => participant.courseBatch, {
    cascade: ['insert', 'update'],
  })
  participants: PersonCourseBatch[];
}
