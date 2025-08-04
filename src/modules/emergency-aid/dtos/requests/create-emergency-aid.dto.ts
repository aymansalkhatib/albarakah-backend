import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { EmergencyAidRequestStatus } from '../../enums/emergency-aid-request-status.enum';

export class CreateEmergencyAidDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  familyId: number;

  @IsOptional()
  @IsEnum(EmergencyAidRequestStatus)
  requestStatus?: EmergencyAidRequestStatus;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  requestedAmount: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  disbursedAmount?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  requestDate?: string;

  @IsOptional()
  @IsDateString()
  disbursementDate?: string;
}
