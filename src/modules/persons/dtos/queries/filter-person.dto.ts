import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxDate,
  Min,
  MinDate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsAfterDate } from '@app/common/decorators/is-after-date.decorator';
import { StrictBoolean } from '@app/common/decorators/strict-boolean.decorator';
import { ClothingSize } from '../../enums/clothing-size.enum';
import { GenderType } from '../../enums/gender-type.enum';
import { PositiveIntegerId } from '@app/common/decorators/positive-integer-id.decorator';

export class FilterPersonDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  fatherName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  motherName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  firstName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  lastName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 11, { message: 'National ID must be exactly 11 characters long' })
  nationalId?: string;

  @IsOptional()
  @StrictBoolean()
  isPalestinian?: boolean;

  @IsOptional()
  @IsEnum(GenderType)
  gender?: GenderType;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  nationality?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  birthPlace?: string;

  @IsOptional()
  @StrictBoolean()
  isWorking?: boolean;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  currentJob?: string;

  @IsOptional()
  @StrictBoolean()
  isSmoker?: boolean;

  @IsOptional()
  @PositiveIntegerId()
  healthStatusId?: number;

  @IsOptional()
  @PositiveIntegerId()
  educationLevelId?: number;

  @IsOptional()
  @PositiveIntegerId()
  schoolTypeId?: number;

  @IsOptional()
  @PositiveIntegerId()
  personStatusId?: number;

  @IsOptional()
  @PositiveIntegerId()
  maritalStatusId?: number;

  @IsOptional()
  @PositiveIntegerId()
  gradeLevelId?: number;

  @IsOptional()
  @IsString()
  @Length(1, 150)
  universityMajor?: string;

  @IsOptional()
  @Length(1, 255)
  @Transform(({ value }) => value?.trim().toLowerCase())
  email?: string;

  @IsOptional()
  @IsString()
  @Length(1, 10)
  phone?: string;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  address?: string;

  @IsOptional()
  @IsInt()
  @Min(16)
  @Max(48)
  shoeSize?: number;

  @IsOptional()
  @IsEnum(ClothingSize)
  clothingSize?: ClothingSize;

  @IsOptional()
  @IsDate()
  @MinDate(new Date('1900-01-01'), { message: 'Birth date must be after 1900-01-01' })
  @MaxDate(new Date(), { message: 'Birth date must be before today' })
  birthDateFrom?: Date;

  @IsOptional()
  @IsDate()
  @MinDate(new Date('1900-01-01'), { message: 'Birth date must be after 1900-01-01' })
  @MaxDate(new Date(), { message: 'Birth date must be before today' })
  @IsAfterDate('birthDateFrom')
  birthDateTo?: Date;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  fatherFirstName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  motherFirstName?: string;
}
