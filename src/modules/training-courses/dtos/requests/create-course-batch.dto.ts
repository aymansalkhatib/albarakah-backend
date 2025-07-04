import { IsOptional, IsString, Length, IsInt, IsDateString, IsPositive } from 'class-validator';

export class CreateCourseBatchDto {
  @IsInt()
  @IsPositive()
  trainingCourseId: number;

  @IsInt()
  @IsPositive()
  batchNumber: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  location?: string;

  @IsOptional()
  @IsString()
  @Length(1, 4000)
  note?: string;
}
