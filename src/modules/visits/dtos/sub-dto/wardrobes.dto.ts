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
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  wardrobesCount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
