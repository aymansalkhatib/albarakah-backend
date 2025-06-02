import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDateString,
  MaxLength,
  Max,
  Min,
  Matches,
} from 'class-validator';
import { Transform, Expose } from 'class-transformer';

export class CreateBeneficiaryFamilyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @Expose()
  familyName: string;

  @MaxLength(20)
  @IsNotEmpty()
  @IsString()
  @Expose()
  familyBookNumber: string;

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
  @IsBoolean()
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

  // @ValidateNested()
  // @Type(() => CreateFamilyRegistrationFormDto)
  // @Expose()
  // registrationForm: CreateFamilyRegistrationFormDto;

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => CreateFamilyMemberDto)
  // @Expose()
  // members?: CreateFamilyMemberDto[];

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => CreateChildDto)
  // @Expose()
  // children?: CreateChildDto[];

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => CreateFamilyNeedDto)
  // @Expose()
  // needs?: CreateFamilyNeedDto[];

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => CreateFamilyIncomeDto)
  // @Expose()
  // income?: CreateFamilyIncomeDto[];

  // @IsOptional()
  // @ValidateNested()
  // @Type(() => CreateHouseDto)
  // @Expose()
  // house?: CreateHouseDto;
}
