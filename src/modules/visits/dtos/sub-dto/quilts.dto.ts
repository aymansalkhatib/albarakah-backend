import { Expose } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Quilts } from '../../interfaces';

export class QuiltsDto implements Quilts {
  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  quiltsCount?: number;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
