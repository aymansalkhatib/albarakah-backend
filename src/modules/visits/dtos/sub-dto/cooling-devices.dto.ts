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
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  airConditionersCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  fansCount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
