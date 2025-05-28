import { Entity, Column, Index } from 'typeorm';
import { CoreEntity } from '../../../shared/modules/app-type-orm/entities/core.entity';

@Entity('training_courses')
@Index(['name'])
export class TrainingCourse extends CoreEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  note?: string;
}
