import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourseBatch } from './course-batch.entity';

@Entity('training_courses')
@Index(['name'])
export class TrainingCourse {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
  // Relationships
  @OneToMany(() => CourseBatch, (batch) => batch.trainingCourse, {
    cascade: ['insert', 'update'],
  })
  batches: CourseBatch[];
}
