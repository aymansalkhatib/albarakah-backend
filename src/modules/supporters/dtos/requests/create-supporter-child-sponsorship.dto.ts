import { IsDate, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { SponsorshipStatus } from '../../enums/sponsorship-status.enum';

export class CreateSupporterChildSponsorshipDto {
  @IsNumber()
  supporterId: number;

  @IsNumber()
  familyMemberId: number;

  @IsDate()
  @Type(() => Date)
  sponsorshipStartDate: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  sponsorshipEndDate?: Date;

  @IsEnum(SponsorshipStatus)
  @IsOptional()
  sponsorshipStatus?: SponsorshipStatus;
}
