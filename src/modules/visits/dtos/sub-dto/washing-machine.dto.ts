import { Expose } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { WashingMachineType } from '../../enums/washing-machine-type.enum';
import { WashingMachine } from '../../interfaces';

export class WashingMachineDto implements WashingMachine {
  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  count?: number;

  @Expose()
  @IsOptional()
  @IsEnum(WashingMachineType)
  type?: WashingMachineType;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(4096)
  notes?: string;
}
