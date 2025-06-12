import {
  IsDate,
  IsDateString,
  IsEmail,
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
import { GenderType } from '../enums/gender-type.enum';
import { ClothingSize } from '../enums/clothing-size.enum';
import { StrictBoolean } from 'src/common/decorators/strict-boolean.decorator';
import { NotEqualTo } from 'src/common/decorators/not-equal-to.decorator';

export class CreatePersonDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  fatherId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @NotEqualTo('fatherId')
  motherId?: number;

  @IsString()
  @Length(3, 100)
  firstName: string;

  @IsString()
  @Length(3, 100)
  lastName: string;

  @IsOptional()
  @IsDate()
  @MinDate(new Date('1900-01-01'), {
    message: 'Birth date must be after 1900-01-01',
  })
  @MaxDate(new Date(), {
    message: 'Birth date must be before today',
  })
  birthDate?: Date;

  @IsOptional()
  @IsString()
  @Length(11, 11, { message: 'National ID must be exactly 11 characters long' })
  nationalId?: string;

  @IsOptional()
  @StrictBoolean()
  isPalestinian?: boolean;

  @IsOptional()
  @IsEnum(GenderType)
  gender?: GenderType;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  nationality?: string;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  birthPlace?: string;

  @IsOptional()
  @StrictBoolean()
  isWorking?: boolean;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  currentJob?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  jobDetails?: string;

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
  @Length(3, 150)
  universityMajor?: string;

  @IsOptional()
  @IsEmail()
  @Length(3, 255)
  @Transform(({ value }) => value?.trim().toLowerCase())
  email?: string;

  @IsOptional()
  @IsString()
  @Length(10)
  phone?: string;

  @IsOptional()
  @IsString()
  @Length(3, 200)
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
  @IsString()
  @Length(3, 200)
  notes?: string;
}
