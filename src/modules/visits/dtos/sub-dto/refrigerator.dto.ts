import { Expose } from 'class-transformer';
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
  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  count?: number;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
