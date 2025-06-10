import {
  IsOptional,
  IsString,
  IsDateString,
  IsBoolean,
  IsEnum,
  IsEmail,
  Length,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { GenderType } from '../enums/gender-type.enum';
import { ClothingSize } from '../enums/clothing-size.enum';
import { IsAfterDate } from 'src/common/decorators/is-after-date.decorator';
import { StrictBoolean } from 'src/common/decorators/strict-boolean.decorator';

export class FilterPersonDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  fatherId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  motherId?: number;

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
  @IsInt()
  @Min(1)
  healthStatusId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  educationLevelId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  schoolTypeId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  personStatusId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  maritalStatusId?: number;

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
  @IsDateString()
  birthDateFrom?: string;

  @IsOptional()
  @IsDateString()
  @IsAfterDate('birthDateFrom')
  birthDateTo?: string;
}
