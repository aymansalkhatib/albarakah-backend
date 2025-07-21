import { IsOptional, IsEnum, IsString, IsDate } from 'class-validator';

import { PaginationQueryDto } from '@app/common/pagination/dto/pagination-query.dto';
import { IsAfterDate } from '@app/common/decorators/is-after-date.decorator';
import { CallStatus } from '../../enums/call-status.enum';
import { RecipientType } from '../../enums/recipient-type.enum';
import { PositiveIntegerId } from '@app/common/decorators/positive-integer-id.decorator';
import { CallDirection } from '../../enums/call-direction.enum';

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
  @IsString()
  responsibleEmployeeName?: string;

  @IsOptional()
  @IsString()
  relatedPersonName?: string;

  @IsOptional()
  @IsEnum(CallDirection)
  callDirection?: CallDirection;

  @IsOptional()
  @IsDate()
  callDateFrom?: Date;

  @IsOptional()
  @IsAfterDate('callDateFrom')
  callDateTo?: Date;
}
