import {
  IsOptional,
  IsString,
  Length,
  IsInt,
  IsDateString,
  IsPositive,
  IsEnum,
} from 'class-validator';
import { PaginationDto } from '@app/common/pagination/dto/pagination.dto';
import { Transform } from 'class-transformer';
import { AttendanceStatus } from '../../enums/attendance-status.enum';

export class FilterPersonCourseBatchDto extends PaginationDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  familyMemberId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  courseBatchId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  trainingCourseId?: number;

  @IsOptional()
  @IsEnum(AttendanceStatus)
  attendanceStatus?: AttendanceStatus;

  @IsOptional()
  @IsDateString()
  joinDateFrom?: string;

  @IsOptional()
  @IsDateString()
  joinDateTo?: string;

  @IsOptional()
  @IsDateString()
  dropOutDateFrom?: string;

  @IsOptional()
  @IsDateString()
  dropOutDateTo?: string;

  @IsOptional()
  @IsString()
  @Length(1, 1000)
  evaluation?: string;

  @IsOptional()
  @IsString()
  @Length(1, 1000)
  notes?: string;
}
