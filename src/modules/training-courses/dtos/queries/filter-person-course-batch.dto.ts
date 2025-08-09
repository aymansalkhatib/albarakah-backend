import { IsDate, IsEnum, IsInt, IsOptional, IsPositive, IsString, Length } from 'class-validator';
import { PaginationDto } from '@app/common/pagination/dto/pagination.dto';
import { Transform, Type } from 'class-transformer';
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
  @Type(() => Date)
  @IsDate()
  @IsLessThanOrEqual('joinDateTo')
  joinDateFrom?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  joinDateTo?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @IsLessThanOrEqual('dropOutDateTo')
  dropOutDateFrom?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dropOutDateTo?: Date;

  @IsOptional()
  @IsString()
  @Length(1, 1000)
  evaluation?: string;

  @IsOptional()
  @IsString()
  @Length(1, 1000)
  notes?: string;
}
