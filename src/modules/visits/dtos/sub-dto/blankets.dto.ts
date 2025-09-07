import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Blankets } from '../../interfaces';

export class BlanketsDto implements Blankets {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  blanketsCount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
