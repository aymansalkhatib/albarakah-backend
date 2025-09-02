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
import { ManagementDecision } from '../../enums/management-decision.enum';
import { SponsorshipStatus } from '../../enums/sponsorship-status.enum';

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
  @IsString()
  @MaxLength(200)
  residencePlace?: string;

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
  @MaxLength(20)
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
  @MaxLength(15)
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

  @IsOptional()
  @IsDate()
  createdAtFrom?: Date;

  @IsOptional()
  @IsDate()
  createdAtTo?: Date;

  @IsOptional()
  @IsDate()
  updatedAtFrom?: Date;

  @IsOptional()
  @IsDate()
  updatedAtTo?: Date;
}
