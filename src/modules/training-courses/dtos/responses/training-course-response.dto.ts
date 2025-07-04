import { Expose } from 'class-transformer';

export class TrainingCourseResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  note?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
