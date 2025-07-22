import { IsDate, IsEnum, IsInt, IsOptional, IsPositive, IsString, Length } from 'class-validator';
import { AttendanceStatus } from '../../enums/attendance-status.enum';
import { IsAfterDate } from '@app/common/decorators/is-after-date.decorator';

export class CreatePersonCourseBatchDto {
  @IsInt()
  @IsPositive()
  familyMemberId: number;

  @IsInt()
  @IsPositive()
  courseBatchId: number;

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
  dropOutDate?: string;

  @IsOptional()
  @IsString()
  @Length(1, 4000)
  notes?: string;
}
