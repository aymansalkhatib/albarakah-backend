import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CallStatus } from '../../enums/call-status.enum';
import { RecipientType } from '../../enums/recipient-type.enum';
import { SyriaPhone } from '@app/common/decorators/syria-phone.decorator';

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

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  receiverId?: number;

  @IsEnum(RecipientType)
  @IsNotEmpty()
  recipientType: RecipientType;

  @IsOptional()
  @IsNumber()
  employeeId?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
