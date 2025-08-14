import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';
import { RequestStatus } from '../../enums/request-status.enum';

export class CreateFamilyRegistrationFormDto {
  @IsNotEmpty()
  @PositiveIntegerId()
  @Expose()
  familyId: number;

  @IsOptional()
  @IsBoolean()
  @Expose()
  motherAgreesTraining?: boolean;

  @IsOptional()
  @IsBoolean()
  @Expose()
  isFormOrganized?: boolean;

  @IsOptional()
  @IsDateString()
  @Expose()
  interviewDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Expose()
  formNotes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Expose()
  managementDecision?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Expose()
  archiveLocation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Expose()
  familyVerificationDocuments?: string;

  @IsOptional()
  @IsBoolean()
  @Expose()
  registeredInOtherCharity?: boolean;

  @IsOptional()
  @IsDateString()
  @Expose()
  emailArrivalDate?: string;

  @IsOptional()
  @IsDateString()
  @Expose()
  applicationApprovalDate?: string;

  @IsOptional()
  @Expose()
  requestStatus?: RequestStatus;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Expose()
  previousRequestStatus?: string;

  @IsOptional()
  @IsBoolean()
  @Expose()
  updatedInSocialAffairs?: boolean;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  @Max(100)
  @Expose()
  mealtimeParticipants?: number;
}
