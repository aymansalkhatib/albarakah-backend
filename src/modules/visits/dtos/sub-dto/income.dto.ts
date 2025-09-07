import { Expose } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Income } from '../../interfaces';

export class IncomeDto implements Income {
  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  amount?: number;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  source?: string;
}
