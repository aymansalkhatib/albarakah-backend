import { IsDate, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus } from '../../enums/attendance-status.enum';
import { IsLessThanOrEqual } from '../../../../common/decorators/is-less-than-or-equal.decorator';

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
  @Type(() => Date)
  @IsDate()
  joinDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dropOutDate?: Date;

  @IsOptional()
  @IsString()
  @Length(1, 4000)
  notes?: string;
}
