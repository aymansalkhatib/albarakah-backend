import { IsOptional, IsString, Length, IsInt, IsDateString, IsPositive } from 'class-validator';
import { PaginationDto } from '@app/common/pagination/dto/pagination.dto';
import { Transform } from 'class-transformer';

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
  note?: string;
}
