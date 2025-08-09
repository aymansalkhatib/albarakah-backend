import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CallStatus } from '../../enums/call-status.enum';
import { ExternalPartyType } from '../../enums/recipient-type.enum';
import { SyriaPhone } from '../../../../common/decorators/syria-phone.decorator';
import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';
import { CallDirection } from '../../enums/call-direction.enum';

export class CreateCallLogDto {
  @IsOptional()
  @IsString()
  callerNumber?: string;

  @IsNotEmpty()
  @IsString()
  @SyriaPhone({ formatToLocal: true })
  recipientNumber: string;

  @IsEnum(CallStatus)
  @IsNotEmpty()
  callStatus: CallStatus;

  @IsOptional()
  @IsDate()
  callDate?: Date;

  @IsOptional()
  @PositiveIntegerId()
  externalPartyId?: number;

  @IsEnum(ExternalPartyType)
  @IsNotEmpty()
  externalPartyType: ExternalPartyType;

  @IsOptional()
  @PositiveIntegerId()
  responsibleEmployeeId?: number;

  @IsEnum(CallDirection)
  callDirection: CallDirection;

  @IsOptional()
  @IsString()
  notes?: string;
}
