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
import { AssistanceType } from '../../enums/assistance-type.enum';

export class CreateReceivedAssistanceDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  familyId: number;

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
  amount?: number;

  @IsNotEmpty()
  @IsDateString()
  deliveryDate: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
