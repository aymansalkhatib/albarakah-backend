import { IsOptional, IsString, Length, IsDateString, IsEnum } from 'class-validator';
import { AttendanceStatus } from '../../enums/attendance-status.enum';

export class UpdatePersonCourseBatchDto {
  @IsOptional()
  @IsEnum(AttendanceStatus)
  attendanceStatus?: AttendanceStatus;

  @IsOptional()
  @IsString()
  @Length(1, 4000)
  evaluation?: string;

  @IsOptional()
  @IsDateString()
  joinDate?: string;

  @IsOptional()
  @IsDateString()
  dropOutDate?: string;

  @IsOptional()
  @IsString()
  @Length(1, 4000)
  notes?: string;
}
