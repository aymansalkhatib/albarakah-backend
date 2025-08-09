import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { PaginationDto } from '../../../../common/pagination/dto/pagination.dto';
import { AssistanceType } from '../../enums/assistance-type.enum';

export class FilterReceivedAssistanceDto extends PaginationDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  familyId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  familyMemberId?: number;

  @IsOptional()
  @IsEnum(AssistanceType)
  assistanceType?: AssistanceType;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amountFrom?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amountTo?: number;

  @IsOptional()
  @IsDateString()
  deliveryDateFrom?: string;

  @IsOptional()
  @IsDateString()
  deliveryDateTo?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}


