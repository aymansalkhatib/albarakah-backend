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
import { StrictBoolean } from '../../../../common/decorators/strict-boolean.decorator';
import { ClothingSize } from '../../enums/clothing-size.enum';
import { CurrentStudyStatus } from '../../enums/current-study-status.enum';
import { EducationLevel } from '../../enums/education-level.enum';
import { GenderType } from '../../enums/gender-type.enum';
import { MaritalStatus } from '../../enums/marital-status.enum';
import { SchoolType } from '../../enums/school-type.enum';
import { SuccessCertificateSubmission } from '../../enums/success-certificate-submission-2023-2024.enum';

export class CreatePersonDto {
  @IsString()
  @Length(3, 300)
  fullName: string;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  motherName?: string;

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
  @Length(3, 200)
  birthPlace?: string;

  @IsOptional()
  @IsString()
  @Length(11, 11, { message: 'National ID must be exactly 11 characters long' })
  nationalId?: string;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  nationality?: string;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  motherNationality?: string;

  @IsOptional()
  @StrictBoolean()
  isPalestinian?: boolean;

  @IsOptional()
  @IsEnum(GenderType)
  gender?: GenderType;

  @IsOptional()
  @IsInt()
  @Min(16)
  @Max(48)
  shoeSize?: number;

  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @IsOptional()
  @StrictBoolean()
  isWorking?: boolean;

  @IsOptional()
  @IsString()
  @Length(3, 200)
  currentJob?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  jobDetails?: string;

  @IsOptional()
  @StrictBoolean()
  isSmoker?: boolean;

  // If healthStatus is a free text in DB (string)
  @IsOptional()
  @IsString()
  @Length(1, 200)
  healthStatus?: string;

  @IsOptional()
  @StrictBoolean()
  isHealthInsuranceUsed?: boolean;

  // Success certificate submission status (enum)
  @IsOptional()
  @IsEnum(SuccessCertificateSubmission)
  isSuccessCertificateSubmitted?: SuccessCertificateSubmission;

  // Education / study enums
  @IsOptional()
  @IsEnum(EducationLevel)
  educationLevel?: EducationLevel;

  @IsOptional()
  @IsString()
  @Length(3, 150)
  universityMajor?: string;

  @IsOptional()
  @IsEnum(CurrentStudyStatus)
  currentStudyStatus?: CurrentStudyStatus;

  @IsOptional()
  @IsEnum(SchoolType)
  schoolType?: SchoolType;

  @IsOptional()
  @IsString()
  @Length(3, 200)
  schoolName?: string;

  // Phones
  @IsOptional()
  @IsString()
  @Length(3, 15)
  mobilePhone?: string;

  @IsOptional()
  @IsString()
  @Length(3, 15)
  landlinePhone?: string;

  @IsOptional()
  @IsString()
  @Length(3, 15)
  whatsappNumber?: string;

  @IsOptional()
  @IsString()
  @Length(1, 2000)
  notes?: string;

  // Clothing & other optional fields kept from previous DTO
  @IsOptional()
  @IsEnum(ClothingSize)
  clothingSize?: ClothingSize;
}
