import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CallStatus } from '../enums/call-status.enum';

export class UpdateCallLogDto {
  @IsOptional()
  @IsEnum(CallStatus)
  callStatus?: CallStatus;

  @IsOptional()
  @IsString()
  note?: string;
}