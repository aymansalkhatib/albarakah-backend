import { Expose } from 'class-transformer';

export class MonthlyFamilyStatsResponseDto {
  @Expose()
  from: Date;
  @Expose()
  to: Date;
  @Expose()
  count: number;
}
