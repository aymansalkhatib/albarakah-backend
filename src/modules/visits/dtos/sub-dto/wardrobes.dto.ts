import { Expose } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Wardrobes } from '../../interfaces';

export class WardrobesDto implements Wardrobes {
  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  wardrobesCount?: number;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
