import { Expose } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Furnishings } from '../../interfaces';

export class FurnishingsDto implements Furnishings {
  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  sofaSets?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  sofas?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  mattresses?: number;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
