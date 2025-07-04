import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
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

  // Note: batches relationship excluded from basic response to avoid circular reference
  // Include in specific endpoints if needed with separate DTO or relation loading
}
