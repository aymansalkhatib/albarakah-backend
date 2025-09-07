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
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  amount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  source?: string;
}
