import {
  IsOptional,
  IsEnum,
  IsString,
  IsNumber,
  IsDateString,
  IsDate,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { PaginationQueryDto } from '@app/common/pagination/dto/pagination-query.dto';
import { IsAfterDate } from '@app/common/decorators/is-after-date.decorator';
import { CallStatus } from '../../enums/call-status.enum';
import { RecipientType } from '../../enums/recipient-type.enum';
import { PositiveIntegerId } from '@app/common/decorators/positive-integer-id.decorator';

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
  @PositiveIntegerId()
  receiverId?: number;

  @IsOptional()
  @IsEnum(RecipientType)
  recipientType: RecipientType;

  @IsOptional()
  @PositiveIntegerId()
  employeeId?: number;

  @IsOptional()
  @IsDate()
  callDateFrom?: Date;

  @IsOptional()
  @IsAfterDate('callDateFrom')
  callDateTo?: Date;

  @IsOptional()
  @IsString()
  recipientName?: string;

  @IsOptional()
  @IsString()
  callerName?: string;
}
