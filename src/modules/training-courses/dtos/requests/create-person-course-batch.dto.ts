import { IsDate, IsEnum, IsInt, IsOptional, IsPositive, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus } from '../../enums/attendance-status.enum';
import { IsLessThanOrEqual } from '../../../../common/decorators/is-less-than-or-equal.decorator';

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
  @Type(() => Date)
  @IsDate()
  @IsLessThanOrEqual('dropOutDate')
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
