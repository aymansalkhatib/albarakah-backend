import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Refrigerator } from '../../interfaces';

export class RefrigeratorDto implements Refrigerator {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  count?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
