import { IsDate, IsNotEmpty } from 'class-validator';
import { IsLessThanOrEqual } from '../decorators/is-less-than-or-equal.decorator';

export class MonthlyStatsQueryDto {
  @IsNotEmpty()
  @IsDate()
  @IsLessThanOrEqual('endDate')
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  endDate: Date;
}
