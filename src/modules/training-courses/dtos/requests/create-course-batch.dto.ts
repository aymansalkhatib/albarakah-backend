import { IsLessThanOrEqual } from '../../../../common/decorators/is-less-than-or-equal.decorator';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsPositive, IsString, Length } from 'class-validator';

export class CreateCourseBatchDto {
  @IsInt()
  @IsPositive()
  trainingCourseId: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  batchNumber?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @IsLessThanOrEqual('endDate', {
    message: 'endDate must be after startDate',
  })
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  location?: string;

  @IsOptional()
  @IsString()
  @Length(1, 4000)
  notes?: string;
}
