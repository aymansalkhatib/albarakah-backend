import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { CarpetsAndMats } from '../../interfaces';

export class CarpetsAndMatsDto implements CarpetsAndMats {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  carpetsCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  matsCount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
