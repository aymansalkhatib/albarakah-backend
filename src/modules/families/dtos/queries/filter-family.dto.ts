import {
  IsDate,
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
import { IsLessThanOrEqual } from '../../../../common/decorators/is-less-than-or-equal.decorator';
import { StrictBoolean } from '../../../../common/decorators/strict-boolean.decorator';
import { ValidateMinMaxPairs } from '../../../../common/decorators/validate-min-max-pairs-constraint';

@ValidateMinMaxPairs()
export class FilterFamilyDto {
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
  @IsLessThanOrEqual('familySuspensionDateTo', {
    message: 'Date from must be before or equal to date to',
  })
  @Expose()
  familySuspensionDateFrom?: Date;

  @IsOptional()
  @IsDate()
  @Expose()
  familySuspensionDateTo?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Expose()
  suspensionReason?: string;

  @IsOptional()
  @StrictBoolean()
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
  @IsDate()
  @Expose()
  registrationDateFrom?: Date;

  @IsOptional()
  @IsDate()
  @Expose()
  registrationDateTo?: Date;

  @IsOptional()
  @IsDate()
  @Expose()
  lastAssessmentDateFrom?: Date;

  @IsOptional()
  @IsDate()
  @Expose()
  lastAssessmentDateTo?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Expose()
  notes?: string;
}
