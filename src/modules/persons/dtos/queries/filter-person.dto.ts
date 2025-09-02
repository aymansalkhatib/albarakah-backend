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
import { IsLessThanOrEqual } from '../../../../common/decorators/is-less-than-or-equal.decorator';
import { StrictBoolean } from '../../../../common/decorators/strict-boolean.decorator';
import { PaginationDto } from '../../../../common/pagination/dto/pagination.dto';
import { CurrentStudyStatus } from '../../enums/current-study-status.enum';
import { EducationLevel } from '../../enums/education-level.enum';
import { GenderType } from '../../enums/gender-type.enum';
import { MaritalStatus } from '../../enums/marital-status.enum';
import { SchoolType } from '../../enums/school-type.enum';
import { SuccessCertificateSubmission } from '../../enums/success-certificate-submission.enum';

export class FilterPersonDto extends PaginationDto {
  // fullName and motherName (match entity)
  @IsOptional()
  @IsString()
  @Length(1, 300)
  fullName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  motherName?: string;

  // birth date range
  @IsOptional()
  @IsDate()
  @IsLessThanOrEqual('birthDateTo')
  @MinDate(new Date('1900-01-01'))
  @MaxDate(new Date())
  birthDateFrom?: Date;

  @IsOptional()
  @IsDate()
  @MinDate(new Date('1900-01-01'))
  @MaxDate(new Date())
  birthDateTo?: Date;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  birthPlace?: string;

  // nationalId exact 11 chars (optional)
  @IsOptional()
  @IsString()
  @Length(11, 11, { message: 'National ID must be exactly 11 characters long' })
  nationalId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  nationality?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  motherNationality?: string;

  @IsOptional()
  @IsEnum(GenderType)
  gender?: GenderType;

  // shoe size (exact or range)
  @IsOptional()
  @IsInt()
  @Min(16)
  @Max(48)
  shoeSize?: number;

  // marital & work
  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @IsOptional()
  @StrictBoolean()
  isWorking?: boolean;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  currentJob?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  jobDetails?: string;

  @IsOptional()
  @StrictBoolean()
  isSmoker?: boolean;

  // health
  @IsOptional()
  @IsString()
  @Length(1, 200)
  healthStatus?: string;

  @IsOptional()
  @StrictBoolean()
  isHealthInsuranceUsed?: boolean;

  // success certificate submission (enum)
  @IsOptional()
  @IsEnum(SuccessCertificateSubmission)
  isSuccessCertificateSubmitted?: SuccessCertificateSubmission;

  // education / study
  @IsOptional()
  @IsEnum(EducationLevel)
  educationLevel?: EducationLevel;

  @IsOptional()
  @IsString()
  @Length(1, 150)
  universityMajor?: string;

  @IsOptional()
  @IsEnum(CurrentStudyStatus)
  currentStudyStatus?: CurrentStudyStatus;

  @IsOptional()
  @IsEnum(SchoolType)
  schoolType?: SchoolType;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  schoolName?: string;

  // phones
  @IsOptional()
  @IsString()
  @Length(3, 15)
  mobilePhone?: string;

  @IsOptional()
  @IsString()
  @Length(3, 15)
  whatsappNumber?: string;

  // notes / address / clothing
  @IsOptional()
  @IsString()
  @Length(1, 2000)
  notes?: string;
}
