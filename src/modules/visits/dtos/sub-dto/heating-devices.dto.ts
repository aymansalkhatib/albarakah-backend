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
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  dieselHeatersCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  gasHeatersCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  woodHeatersCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  electricHeatersCount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
