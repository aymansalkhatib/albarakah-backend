import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { Beds } from '../../interfaces';

export class BedsDto implements Beds {
  @Expose()
  @IsOptional()
  @IsNumber()
  bedsCount?: number;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(4096)
  notes?: string;
}
