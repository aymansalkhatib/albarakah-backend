import { Expose } from 'class-transformer';
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
  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  blanketsCount?: number;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(4096)
  notes?: string;
}
