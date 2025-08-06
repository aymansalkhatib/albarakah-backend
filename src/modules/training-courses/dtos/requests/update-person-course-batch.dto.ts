import { IsDate, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { AttendanceStatus } from '../../enums/attendance-status.enum';
import { IsLessThanOrEqual } from '@app/common/decorators/is-less-than-or-equal.decorator';

export class UpdatePersonCourseBatchDto {
  @IsOptional()
  @IsEnum(AttendanceStatus)
  attendanceStatus?: AttendanceStatus;

  @IsOptional()
  @IsString()
  @Length(1, 4000)
  evaluation?: string;

  @IsOptional()
  @IsLessThanOrEqual('dropOutDate')
  @IsDate()
  joinDate?: Date;

  @IsOptional()
  @IsDate()
  dropOutDate?: Date;

  @IsOptional()
  @IsString()
  @Length(1, 4000)
  notes?: string;
}
