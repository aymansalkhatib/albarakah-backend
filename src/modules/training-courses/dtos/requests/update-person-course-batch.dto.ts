import { IsOptional, IsString, Length, IsDateString, IsEnum, IsDate } from 'class-validator';
import { AttendanceStatus } from '../../enums/attendance-status.enum';
import { IsAfterDate } from '@app/common/decorators/is-after-date.decorator';

export class UpdatePersonCourseBatchDto {
  @IsOptional()
  @IsEnum(AttendanceStatus)
  attendanceStatus?: AttendanceStatus;

  @IsOptional()
  @IsString()
  @Length(1, 4000)
  evaluation?: string;

  @IsOptional()
  @IsDate()
  joinDate?: Date;

  @IsOptional()
  @IsDate()
  @IsAfterDate('joinDate')
  dropOutDate?: Date;

  @IsOptional()
  @IsString()
  @Length(1, 4000)
  notes?: string;
}
