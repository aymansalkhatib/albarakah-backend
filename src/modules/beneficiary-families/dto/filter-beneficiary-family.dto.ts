import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { StrictBoolean } from '../../../common/decorators/strict-boolean.decorator';
import { ValidateMinMaxPairs } from '../../../common/decorators/validate-min-max-pairs-constraint';
import { IsAfterDate } from '../../../common/decorators/is-after-date.decorator';

@ValidateMinMaxPairs()
export class FilterBeneficiaryFamilyDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  @Expose()
  familyName?: string;

  @IsOptional()
  @MaxLength(20)
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]+$/, { message: 'Family book number must be exactly 20 digits' })
  @Expose()
  familyBookNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  @Expose()
  landlinePhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  @Matches(/^[0-9]{1,10}$/, { message: 'Mobile phone must be between 1 and 10 digits' })
  @Expose()
  mobilePhone?: string;

  @IsOptional()
  @StrictBoolean()
  @Expose()
  isDisplaced?: boolean;

  @IsOptional()
  @StrictBoolean()
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
  @IsAfterDate('familySuspensionDateFrom')
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
