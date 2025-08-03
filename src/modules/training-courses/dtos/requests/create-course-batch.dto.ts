import { IsLessThanOrEqual } from '@app/common/decorators/is-less-than-or-equal.decorator';
import { IsDate, IsInt, IsOptional, IsPositive, IsString, Length } from 'class-validator';

export class CreateCourseBatchDto {
  @IsInt()
  @IsPositive()
  trainingCourseId: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  batchNumber: number;

  @IsOptional()
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @IsLessThanOrEqual('startDate', {
    message: 'endDate must be after startDate',
  })
  endDate?: Date;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  location?: string;

  @IsOptional()
  @IsString()
  @Length(1, 4000)
  note?: string;
}
