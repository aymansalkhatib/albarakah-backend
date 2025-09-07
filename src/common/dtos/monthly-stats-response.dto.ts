import { Expose } from 'class-transformer';

export class MonthlyStatsResponseDto {
  @Expose()
  from: Date;
  @Expose()
  to: Date;
  @Expose()
  count: number;
}
