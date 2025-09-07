import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { MobileStatus } from '../../enums/mobile-status.enum';
import { HouseholdItems } from '../../interfaces';

export class HouseholdItemsDto implements HouseholdItems {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  tables?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  chairs?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  batteries?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  televisions?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  screens?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  waterCoolers?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  microwaves?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  vacuumCleaners?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  computers?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  laptops?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  routers?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  landlinePhones?: number;

  @IsEnum(MobileStatus)
  mobilePhones: MobileStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  electricOvens?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  freezers?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
