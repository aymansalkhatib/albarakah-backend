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
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  quiltsCount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
