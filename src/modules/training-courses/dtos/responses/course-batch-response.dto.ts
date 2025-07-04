import { Expose, Type } from 'class-transformer';
import { TrainingCourseResponseDto } from './training-course-response.dto';

export class CourseBatchResponseDto {
  @Expose()
  id: number;

  @Expose()
  trainingCourseId: number;

  @Expose()
  batchNumber: number;

  @Expose()
  startDate?: Date;

  @Expose()
  endDate?: Date;

  @Expose()
  location?: string;

  @Expose()
  note?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => TrainingCourseResponseDto)
  trainingCourse?: TrainingCourseResponseDto;
}
