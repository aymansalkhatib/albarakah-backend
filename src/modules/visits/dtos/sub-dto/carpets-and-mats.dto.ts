import { Expose } from 'class-transformer';
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
  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  carpetsCount?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  matsCount?: number;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
