import { Expose } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { HeatingDevices } from '../../interfaces';

export class HeatingDevicesDto implements HeatingDevices {
  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  dieselHeatersCount?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  gasHeatersCount?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  woodHeatersCount?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  electricHeatersCount?: number;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(4096)
  notes?: string;
}
