import { IsOptional, IsPositive } from 'class-validator';
import { MonthlyStatsQueryDto } from './monthly-stats-query.dto';

export class CourseMonthlyStatsQueryDto extends MonthlyStatsQueryDto {
  @IsOptional()
  @IsPositive()
  trainingCourseId?: number;
}
