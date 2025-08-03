import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from '@app/common/pagination/dto/pagination-query.dto';
import { IsLessThanOrEqual } from '@app/common/decorators/is-less-than-or-equal.decorator';
import { CallStatus } from '../../enums/call-status.enum';
import { ExternalPartyType } from '../../enums/recipient-type.enum';
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
  externalPartyId?: number;

  @IsOptional()
  @IsEnum(ExternalPartyType)
  externalPartyType: ExternalPartyType;

  @IsOptional()
  @IsString()
  responsibleEmployeeName?: string;

  @IsOptional()
  @IsString()
  externalPartyName?: string;

  @IsOptional()
  @IsEnum(CallDirection)
  callDirection?: CallDirection;

  @IsOptional()
  @IsDate()
  callDateFrom?: Date;

  @IsOptional()
  @IsLessThanOrEqual('callDateFrom')
  callDateTo?: Date;
}
