import { Expose, Type } from 'class-transformer';
import { EmployeeResponseDto } from '../../../employees/dtos/responses/employee-response.dto';
import { FamilyMemberResponseDto } from '../../../family-members/dtos/responses/family-member-response.dto';
import { ArchiveLocation } from '../../enums/archive-location.enum';
import { FormOrganizationStatus } from '../../enums/form-organization-status.enum';
import { ManagementDecision } from '../../enums/management-decision.enum';
import { SponsorshipStatus } from '../../enums/sponsorship-status.enum';

export class FamilyResponseDto {
  @Expose()
  id: number;

  @Expose()
  requestNumber?: string;

  @Expose()
  familyName: string;

  @Expose()
  isHusbandPalestinian?: boolean;

  @Expose()
  identityDocuments?: string;

  @Expose()
  emailArrivalDate?: Date;

  @Expose()
  contactedByEmployeeId?: number;

  @Expose()
  isRegisteredInOtherOrphanAssociation?: boolean;

  @Expose()
  otherOrphanAssociationName?: string;

  @Expose()
  residencePlace?: string;

  @Expose()
  formOrganizationStatus?: FormOrganizationStatus;

  @Expose()
  formNumber: string;

  @Expose()
  interviewDate?: Date;

  @Expose()
  managementDecision?: ManagementDecision;

  @Expose()
  formOrganizerNotes?: string;

  @Expose()
  archiveLocation?: ArchiveLocation;

  @Expose()
  familyBookNumber: string;

  @Expose()
  landlinePhone?: string;

  @Expose()
  mobilePhone?: string;

  @Expose()
  isRefugee?: boolean;

  @Expose()
  isExtremelyPoor?: boolean;

  @Expose()
  sponsorshipStatus?: SponsorshipStatus;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => FamilyMemberResponseDto)
  familyMembers?: FamilyMemberResponseDto[];

  @Expose()
  @Type(() => EmployeeResponseDto)
  contactedByEmployee?: EmployeeResponseDto;
}
