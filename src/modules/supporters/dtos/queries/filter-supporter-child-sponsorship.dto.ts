import { IsDate, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { SponsorshipStatus } from '../../enums/sponsorship-status.enum';
import { PositiveIntPipe } from '@app/common/pipes/positive-int.pipe';
import { PositiveIntegerId } from '@app/common/decorators/positive-integer-id.decorator';
import { LessThanOrEqual } from 'typeorm';
import { IsLessThanOrEqual } from '@app/common/decorators/is-less-than-or-equal.decorator';

export class FilterSupporterChildSponsorshipDto {
  @IsOptional()
  @PositiveIntegerId()
  supporterId?: number;

  @IsOptional()
  @PositiveIntegerId()
  familyMemberId?: number;

  @IsOptional()
  @IsEnum(SponsorshipStatus)
  sponsorshipStatus?: SponsorshipStatus;

  @IsOptional()
  @IsDate()
  @IsLessThanOrEqual('sponsorshipEndDate')
  sponsorshipStartDate: Date;

  @IsOptional()
  @IsDate()
  sponsorshipEndDate?: Date;
}
