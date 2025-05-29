import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsDateString,
  IsInt,
  Length,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { GenderType, ClothingSize } from '../entities/person.entity';

export class CreatePersonDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  fatherId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  motherId?: number;

  @IsString()
  @Length(3, 100)
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @IsString()
  @Length(3, 100)
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  @Length(11)
  @Transform(({ value }) => value?.trim())
  nationalId?: string;

  @IsOptional()
  @IsBoolean()
  isPalestinian?: boolean;

  @IsOptional()
  @IsEnum(GenderType)
  gender?: GenderType;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  @Transform(({ value }) => value?.trim())
  nationality?: string;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  @Transform(({ value }) => value?.trim())
  birthPlace?: string;

  @IsOptional()
  @IsBoolean()
  isWorking?: boolean;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  @Transform(({ value }) => value?.trim())
  currentJob?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(1, 500)
  jobDetails?: string;

  @IsOptional()
  @IsBoolean()
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
  @Transform(({ value }) => value?.trim())
  universityMajor?: string;

  @IsOptional()
  @IsEmail()
  @Length(3, 255)
  @Transform(({ value }) => value?.trim().toLowerCase())
  email?: string;

  @IsOptional()
  @IsString()
  @Length(10)
  @Transform(({ value }) => value?.trim())
  phone?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
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
  @Transform(({ value }) => value?.trim())
  @Length(3, 200)
  notes?: string;
}
