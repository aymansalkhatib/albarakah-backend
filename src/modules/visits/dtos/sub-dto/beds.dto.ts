import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Beds } from '../../interfaces';

export class BedsDto implements Beds {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  bedsCount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
