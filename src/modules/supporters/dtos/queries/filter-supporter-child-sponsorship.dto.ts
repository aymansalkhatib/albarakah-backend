import { IsDate, IsEnum, IsOptional } from 'class-validator';
import { SponsorshipStatus } from '../../enums/sponsorship-status.enum';
import { PositiveIntegerId } from '@app/common/decorators/positive-integer-id.decorator';
import { IsLessThanOrEqual } from '@app/common/decorators/is-less-than-or-equal.decorator';
import { FilterPersonDto } from '@app/modules/persons/dtos/queries/filter-person.dto';
import { Type } from 'class-transformer';

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

  @IsOptional()
  @Type(() => FilterPersonDto)
  person?: FilterPersonDto;
}
