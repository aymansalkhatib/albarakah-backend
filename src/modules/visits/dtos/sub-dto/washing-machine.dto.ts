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
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  count?: number;

  @IsOptional()
  @IsEnum(WashingMachineType)
  type?: WashingMachineType;

  @IsOptional()
  @IsString()
  @MaxLength(4096)
  notes?: string;
}
