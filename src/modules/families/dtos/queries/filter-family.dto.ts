import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { StrictBoolean } from '../../../../common/decorators/strict-boolean.decorator';
import { ValidateMinMaxPairs } from '../../../../common/decorators/validate-min-max-pairs-constraint';
import { PaginationDto } from '../../../../common/pagination/dto/pagination.dto';
import { ArchiveLocation } from '../../enums/archive-location.enum';
import { FormOrganizationStatus } from '../../enums/form-organization-status.enum';
import { HouseType } from '../../enums/house-type.enum';
import { ManagementDecision } from '../../enums/management-decision.enum';
import { RequestStatus } from '../../enums/request-status.enum';
import { SponsorshipStatus } from '../../enums/sponsorship-status.enum';
import { VoucherValue } from '../../enums/voucher-value.enum';

@ValidateMinMaxPairs()
export class FilterFamilyDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @MaxLength(32)
  requestNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  familyName?: string;

  @IsOptional()
  @StrictBoolean()
  isHusbandPalestinian?: boolean;

  @IsOptional()
  @IsString()
  identityDocuments?: string;

  @IsOptional()
  @IsDate()
  emailArrivalDateFrom?: Date;

  @IsOptional()
  @IsDate()
  emailArrivalDateTo?: Date;

  @IsOptional()
  @IsNumber()
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

  @IsOptional()
  @IsString()
  @MaxLength(64)
  formNumber?: string;

  @IsOptional()
  @IsDate()
  interviewDateFrom?: Date;

  @IsOptional()
  @IsDate()
  interviewDateTo?: Date;

  @IsOptional()
  @IsEnum(ManagementDecision)
  managementDecision?: ManagementDecision;

  @IsOptional()
  @IsString()
  formOrganizerNotes?: string;

  @IsOptional()
  @IsEnum(ArchiveLocation)
  archiveLocation?: ArchiveLocation;

  @IsOptional()
  @MaxLength(12)
  @IsNotEmpty()
  @IsString()
  familyBookNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  landlinePhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
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
  @IsDate()
  requestAcceptanceDateFrom?: Date;

  @IsOptional()
  @IsDate()
  requestAcceptanceDateTo?: Date;

  @IsOptional()
  @IsDate()
  requestSuspensionDateFrom?: Date;

  @IsOptional()
  @IsDate()
  requestSuspensionDateTo?: Date;

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
  beneficiaryFamilyMembersCountMin?: number;

  @IsOptional()
  @IsNumber()
  beneficiaryFamilyMembersCountMax?: number;

  @IsOptional()
  @IsNumber()
  guardianFamilyMembersCountMin?: number;

  @IsOptional()
  @IsNumber()
  guardianFamilyMembersCountMax?: number;

  @IsOptional()
  @IsNumber()
  sharedMealMembersCountMin?: number;

  @IsOptional()
  @IsNumber()
  sharedMealMembersCountMax?: number;

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
