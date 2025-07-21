import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Validate } from 'class-validator';
import { CallStatus } from '../enums/call-status.enum';
import { CallerTypeEnum } from '../enums/caller-type.enum';
import { IsValidPhoneNumber } from '../Validators/phone-number.validator';
import { IsCallerNumberRequired } from '../Validators/caller-number-required.validator';

export class CreateCallLogDto {
  @IsOptional()
  @IsString()
  @Validate(IsValidPhoneNumber)
  @Validate(IsCallerNumberRequired)
  callerNumber?: string;

  @IsNotEmpty()
  @IsString()
  @Validate(IsValidPhoneNumber)
  recipientNumber: string;

  @IsEnum(CallStatus)
  @IsNotEmpty()
  callStatus: CallStatus;

  @IsNumber()
  @IsNotEmpty()
  receiverId: number;

  @IsEnum(CallerTypeEnum)
  @IsNotEmpty()
  callerType: CallerTypeEnum;

  @IsOptional()
  @IsNumber()
  employeeId?: number;

  @IsOptional()
  @IsString()
  note?: string;
}