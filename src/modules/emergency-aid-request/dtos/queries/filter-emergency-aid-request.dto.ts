import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { PaginationDto } from '../../../../common/pagination/dto/pagination.dto';
import { EmergencyAidRequestStatus } from '../../enums/emergency-aid-request-status.enum';

export class FilterEmergencyAidRequestDto extends PaginationDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  familyId?: number;

  @IsOptional()
  @IsEnum(EmergencyAidRequestStatus)
  requestStatus?: EmergencyAidRequestStatus;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  requestedAmountFrom?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  requestedAmountTo?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  disbursedAmountFrom?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  disbursedAmountTo?: number;

  @IsOptional()
  @IsDateString()
  requestDateFrom?: string;

  @IsOptional()
  @IsDateString()
  requestDateTo?: string;

  @IsOptional()
  @IsDateString()
  disbursementDateFrom?: string;

  @IsOptional()
  @IsDateString()
  disbursementDateTo?: string;

  @IsOptional()
  @IsString()
  familyName?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
