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
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  sofaSets?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  sofas?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  mattresses?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
