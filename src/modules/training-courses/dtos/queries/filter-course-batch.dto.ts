import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { IsLessThanOrEqual } from '../../../../common/decorators/is-less-than-or-equal.decorator';
import { PaginationDto } from '../../../../common/pagination/dto/pagination.dto';

export class FilterCourseBatchDto extends PaginationDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  trainingCourseId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  batchNumber?: number;

  @IsOptional()
  @IsDateString()
  @IsLessThanOrEqual('endDate', {
    message: 'endDate must be after startDate',
  })
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
  @Length(1, 1000)
  notes?: string;
}
