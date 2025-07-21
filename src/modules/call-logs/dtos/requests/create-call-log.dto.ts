import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CallStatus } from '../../enums/call-status.enum';
import { RecipientType } from '../../enums/recipient-type.enum';
import { SyriaPhone } from '@app/common/decorators/syria-phone.decorator';
import { PositiveIntegerId } from '@app/common/decorators/positive-integer-id.decorator';
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
  @PositiveIntegerId()
  receiverId?: number;

  @IsEnum(RecipientType)
  @IsNotEmpty()
  recipientType: RecipientType;

  @IsOptional()
  @PositiveIntegerId()
  responsibleEmployeeId?: number;

  @IsEnum(CallDirection)
  @IsNotEmpty()
  callDirection: CallDirection;

  @IsOptional()
  @IsString()
  notes?: string;
}
