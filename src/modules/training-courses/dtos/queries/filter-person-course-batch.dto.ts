import {
  IsOptional,
  IsString,
  Length,
  IsInt,
  IsDateString,
  IsPositive,
  IsEnum,
  IsDate,
} from 'class-validator';
import { PaginationDto } from '@app/common/pagination/dto/pagination.dto';
import { Transform } from 'class-transformer';
import { AttendanceStatus } from '../../enums/attendance-status.enum';
import { IsAfterDate } from '@app/common/decorators/is-after-date.decorator';

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
  @IsDate()
  joinDateFrom?: string;

  @IsOptional()
  @IsDate()
  @IsAfterDate('joinDateFrom')
  joinDateTo?: string;

  @IsOptional()
  @IsDate()
  dropOutDateFrom?: string;

  @IsOptional()
  @IsDate()
  @IsAfterDate('dropOutDateFrom')
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
