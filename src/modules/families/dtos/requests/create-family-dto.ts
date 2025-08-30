import {
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

import { Expose, Transform } from 'class-transformer';
import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';
import { StrictBoolean } from '../../../../common/decorators/strict-boolean.decorator';

export class CreateFamilyDto {
  @PositiveIntegerId()
  registrationFormId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @Expose()
  familyName: string;

  @MaxLength(20)
  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]+$/, { message: 'Family book number must be exactly 20 digits' })
  @Expose()
  familyBookNumber: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  @Matches(/^0\d{2}\d{6,7}$/, {
    message:
      'The Syrian landline number must start with 0, followed by a 2-digit area code and then 6 or 7 digits.',
  })
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
  voucherAmount?: number;

  @IsOptional()
  @IsDateString()
  @Expose()
  familySuspensionDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Expose()
  suspensionReason?: string;

  @IsOptional()
  @StrictBoolean()
  @Expose()
  motherIsTrainingBeneficiary?: boolean;

  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  @Max(1_000_000_000)
  @Expose()
  childrenSchoolExpenses: number;

  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  @Max(1_000_000_000)
  @Expose()
  incomeFromBarakaAssociation: number;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => value || new Date().toISOString().split('T')[0])
  @Expose()
  registrationDate?: string;

  @IsOptional()
  @IsDateString()
  @Expose()
  lastAssessmentDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Expose()
  notes?: string;
}
