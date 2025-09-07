import { Expose } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { GasOven } from '../../interfaces';

export class GasOvenDto implements GasOven {
  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  count?: number;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  type?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
