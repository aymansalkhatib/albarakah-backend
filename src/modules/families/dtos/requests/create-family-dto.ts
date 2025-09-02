import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';
import { StrictBoolean } from '../../../../common/decorators/strict-boolean.decorator';
import { SyriaPhone } from '../../../../common/decorators/syria-phone.decorator';
import { ArchiveLocation } from '../../enums/archive-location.enum';
import { FormOrganizationStatus } from '../../enums/form-organization-status.enum';
import { HouseType } from '../../enums/house-type.enum';
import { ManagementDecision } from '../../enums/management-decision.enum';
import { RequestStatus } from '../../enums/request-status.enum';
import { SponsorshipStatus } from '../../enums/sponsorship-status.enum';
import { VoucherValue } from '../../enums/voucher-value.enum';

export class CreateFamilyDto {
  @IsOptional()
  @IsString()
  @MaxLength(32)
  requestNumber?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  familyName: string;

  @IsOptional()
  @StrictBoolean()
  isHusbandPalestinian?: boolean;

  @IsOptional()
  @IsString()
  identityDocuments?: string;

  @IsOptional()
  @IsDateString()
  emailArrivalDate?: string;

  @IsOptional()
  @PositiveIntegerId()
  contactedByEmployeeId?: number;

  @IsOptional()
  @StrictBoolean()
  isRegisteredInOtherOrphanAssociation?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  otherOrphanAssociationName?: string;

  @IsOptional()
  @IsEnum(FormOrganizationStatus)
  formOrganizationStatus?: FormOrganizationStatus;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  formNumber: string;

  @IsOptional()
  @IsDateString()
  interviewDate?: string;

  @IsOptional()
  @IsEnum(ManagementDecision)
  managementDecision?: ManagementDecision;

  @IsOptional()
  @IsString()
  formOrganizerNotes?: string;

  @IsOptional()
  @IsEnum(ArchiveLocation)
  archiveLocation?: ArchiveLocation;

  @MaxLength(12)
  @IsNotEmpty()
  @IsString()
  familyBookNumber: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  @Matches(/^0\d{2}\d{6,7}$/, {
    message:
      'The Syrian landline number must start with 0, followed by a 2-digit area code and then 6 or 7 digits.',
  })
  landlinePhone?: string;

  @IsOptional()
  @IsString()
  @SyriaPhone({ formatToLocal: true })
  mobilePhone?: string;

  @IsOptional()
  @StrictBoolean()
  isRefugee?: boolean;

  @IsOptional()
  @StrictBoolean()
  isExtremelyPoor?: boolean;

  @IsOptional()
  @IsEnum(SponsorshipStatus)
  sponsorshipStatus?: SponsorshipStatus;

  // === REQUEST INFO ===
  @IsOptional()
  @IsDateString()
  requestAcceptanceDate?: string;

  @IsOptional()
  @IsDateString()
  requestSuspensionDate?: string;

  @IsOptional()
  @IsEnum(RequestStatus)
  requestStatus?: RequestStatus;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  previousRequestStatus?: string;

  @IsOptional()
  @StrictBoolean()
  isStatusUpdatedAtSocialAffairs?: boolean;

  // === COUNTS & VALUES ===
  @IsOptional()
  @IsNumber()
  beneficiaryFamilyMembersCount?: number;

  @IsOptional()
  @IsNumber()
  guardianFamilyMembersCount?: number;

  @IsOptional()
  @IsNumber()
  sharedMealMembersCount?: number;

  @IsOptional()
  @IsEnum(VoucherValue)
  voucherValue?: VoucherValue;

  @IsOptional()
  @IsEnum(HouseType)
  houseType?: HouseType;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  currentResidenceAddress?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  currentResidenceArea?: string;
}
