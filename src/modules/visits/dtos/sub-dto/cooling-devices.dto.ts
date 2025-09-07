import { Expose } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { CoolingDevices } from '../../interfaces';

export class CoolingDevicesDto implements CoolingDevices {
  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  airConditionersCount?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  fansCount?: number;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(4096)
  notes?: string;
}
