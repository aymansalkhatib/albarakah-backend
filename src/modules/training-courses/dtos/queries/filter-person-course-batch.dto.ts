import { IsDate, IsEnum, IsInt, IsOptional, IsPositive, IsString, Length } from 'class-validator';
import { PaginationDto } from '@app/common/pagination/dto/pagination.dto';
import { Transform } from 'class-transformer';
import { AttendanceStatus } from '../../enums/attendance-status.enum';
import { IsLessThanOrEqual } from '@app/common/decorators/is-less-than-or-equal.decorator';

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
  @IsLessThanOrEqual('joinDateTo')
  joinDateFrom?: string;

  @IsOptional()
  @IsDate()
  joinDateTo?: string;

  @IsOptional()
  @IsDate()
  @IsLessThanOrEqual('dropOutDateFrom')
  dropOutDateFrom?: string;

  @IsOptional()
  @IsDate()
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
