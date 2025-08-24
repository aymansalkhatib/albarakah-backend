import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { IsLessThanOrEqual } from '../../../../common/decorators/is-less-than-or-equal.decorator';
import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';
import { FilterPersonDto } from '../../../../modules/persons/dtos/queries/filter-person.dto';
import { SponsorshipStatus } from '../../enums/sponsorship-status.enum';

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
  @ValidateNested()
  @Type(() => FilterPersonDto)
  person?: FilterPersonDto;
}
