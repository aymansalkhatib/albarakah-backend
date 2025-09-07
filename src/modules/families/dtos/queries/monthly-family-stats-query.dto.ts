import { IsDate, IsNotEmpty } from 'class-validator';
import { IsLessThanOrEqual } from '../../../../common/decorators/is-less-than-or-equal.decorator';

export class MonthlyFamilyStatsQueryDto {
  @IsNotEmpty()
  @IsDate()
  @IsLessThanOrEqual('endDate')
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  endDate: Date;
}
