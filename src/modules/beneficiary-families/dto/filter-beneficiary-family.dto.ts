import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsDateString,
  Min,
  Max,
  MaxLength,
  Matches,
} from 'class-validator';
import { Expose } from 'class-transformer';

export class FilterBeneficiaryFamilyDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  @Expose()
  familyName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Expose()
  familyBookNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  @Matches(/^[0-9]{10}$/, { message: 'Landline phone must be exactly 10 digits' })
  @Expose()
  landlinePhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  @Matches(/^[0-9]{10}$/, { message: 'Mobile phone must be exactly 10 digits' })
  @Expose()
  mobilePhone?: string;

  @IsOptional()
  @IsBoolean()
  @Expose()
  isDisplaced?: boolean;

  @IsOptional()
  @IsBoolean()
  @Expose()
  isExtremelyPoor?: boolean;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  @Max(1_000_000_000)
  @Expose()
  minVoucherAmount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  @Max(1_000_000_000)
  @Expose()
  maxVoucherAmount?: number;

  @IsOptional()
  @IsDateString()
  @Expose()
  familySuspensionDateFrom?: string;

  @IsOptional()
  @IsDateString()
  @Expose()
  familySuspensionDateTo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Expose()
  suspensionReason?: string;

  @IsOptional()
  @IsBoolean()
  @Expose()
  motherIsTrainingBeneficiary?: boolean;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  @Max(1_000_000_000)
  @Expose()
  minChildrenSchoolExpenses?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  @Max(1_000_000_000)
  @Expose()
  maxChildrenSchoolExpenses?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  @Max(1_000_000_000)
  @Expose()
  minIncomeFromBarakaAssociation?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  @Max(1_000_000_000)
  @Expose()
  maxIncomeFromBarakaAssociation?: number;

  @IsOptional()
  @IsDateString()
  @Expose()
  registrationDateFrom?: string;

  @IsOptional()
  @IsDateString()
  @Expose()
  registrationDateTo?: string;

  @IsOptional()
  @IsDateString()
  @Expose()
  lastAssessmentDateFrom?: string;

  @IsOptional()
  @IsDateString()
  @Expose()
  lastAssessmentDateTo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Expose()
  notes?: string;
}
