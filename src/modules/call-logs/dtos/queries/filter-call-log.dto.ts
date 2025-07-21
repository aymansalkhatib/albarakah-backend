import { IsOptional, IsEnum, IsString, IsNumber, IsDateString, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

import { PaginationQueryDto } from '@app/common/pagination/dto/pagination-query.dto';
import { IsAfterDate } from '@app/common/decorators/is-after-date.decorator';
import { CallStatus } from '../../enums/call-status.enum';
import { RecipientType } from '../../enums/recipient-type.enum';

export class FilterCallLogDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  callerNumber?: string;

  @IsOptional()
  @IsString()
  recipientNumber?: string;

  @IsOptional()
  @IsEnum(CallStatus)
  callStatus?: CallStatus;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  receiverId?: number;

  @IsOptional()
  @IsEnum(RecipientType)
  recipientType: RecipientType;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  employeeId?: number;

  @IsOptional()
  @IsDate()
  callDateFrom?: Date;

  @IsOptional()
  @IsAfterDate('callDateFrom')
  callDateTo?: Date;
}
