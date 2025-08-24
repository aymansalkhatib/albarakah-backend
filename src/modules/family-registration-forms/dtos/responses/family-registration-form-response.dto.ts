import { FamilyResponseDto } from '../../../families/dtos/responses/family-response.dto';
import { Expose, Transform, Type } from 'class-transformer';
import { RequestStatus } from '../../enums/request-status.enum';

export class FamilyRegistrationFormResponseDto {
  @Expose()
  id: number;

  @Expose()
  motherAgreesTraining?: boolean;

  @Expose()
  isFormOrganized?: boolean;

  @Expose()
  @Transform(({ value }) => (value ? new Date(value).toISOString().split('T')[0] : null))
  interviewDate?: Date;

  @Expose()
  formNotes?: string;

  @Expose()
  managementDecision?: string;

  @Expose()
  archiveLocation?: string;

  @Expose()
  familyVerificationDocuments?: string;

  @Expose()
  registeredInOtherCharity?: boolean;

  @Expose()
  @Transform(({ value }) => (value ? new Date(value).toISOString().split('T')[0] : null))
  emailArrivalDate?: Date;

  @Expose()
  @Transform(({ value }) => (value ? new Date(value).toISOString().split('T')[0] : null))
  applicationApprovalDate?: Date;

  @Expose()
  requestStatus: RequestStatus;

  @Expose()
  previousRequestStatus?: string;

  @Expose()
  updatedInSocialAffairs?: boolean;

  @Expose()
  mealtimeParticipants?: number;

  @Expose()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : null))
  createdAt: Date;

  @Expose()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : null))
  updatedAt: Date;

  @Expose()
  @Type(() => FamilyResponseDto)
  family?: FamilyResponseDto;
}
