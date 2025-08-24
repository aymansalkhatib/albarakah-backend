import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateFamilyDto } from '../../../families/dtos/requests/create-family-dto';
import { CreateFamilyMemberDto } from '../../../family-members/dtos/requests/create-family-member.dto';
import { CreateGuardianDto } from '../../../guardians/dtos/requests/create-guardian.dto';
import { CreateHouseDto } from '../../../houses/dtos/requests/create-house.dto';
import { RequestStatus } from '../../enums/request-status.enum';

export class CreateFamilyRegistrationFormDto {
  @IsOptional()
  @IsBoolean()
  motherAgreesTraining?: boolean;

  @IsOptional()
  @IsBoolean()
  isFormOrganized?: boolean;

  @IsOptional()
  @IsDateString()
  interviewDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  formNotes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  managementDecision?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  archiveLocation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  familyVerificationDocuments?: string;

  @IsOptional()
  @IsBoolean()
  registeredInOtherCharity?: boolean;

  @IsOptional()
  @IsDateString()
  emailArrivalDate?: string;

  @IsOptional()
  @IsDateString()
  applicationApprovalDate?: string;

  @IsOptional()
  @IsEnum(RequestStatus)
  requestStatus?: RequestStatus;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  previousRequestStatus?: string;

  @IsOptional()
  @IsBoolean()
  updatedInSocialAffairs?: boolean;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  @Max(100)
  mealtimeParticipants?: number;

  @IsNotEmpty()
  @Type(() => CreateFamilyDto)
  family: CreateFamilyDto;

  @IsNotEmpty()
  @IsOptional()
  @Type(() => OmitType(CreateHouseDto, ['familyId'] as const))
  house?: Omit<CreateHouseDto, 'familyId'>;

  @IsNotEmpty()
  @Type(() => CreateGuardianDto)
  guardians: CreateGuardianDto;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OmitType(CreateFamilyMemberDto, ['familyId'] as const))
  familyMembers: Omit<CreateFamilyMemberDto, 'familyId'>[];
}
