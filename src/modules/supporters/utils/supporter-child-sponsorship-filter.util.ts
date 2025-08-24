import { SelectQueryBuilder } from 'typeorm';
import { FilterSupporterChildSponsorshipDto } from '../dtos/queries/filter-supporter-child-sponsorship.dto';
import { SupporterChildSponsorship } from '../entities/supporters-children.entity';

export function applySupporterChildSponsorshipFilters(
  qb: SelectQueryBuilder<any>,
  alias: string,
  filterDto?: FilterSupporterChildSponsorshipDto,
): SelectQueryBuilder<SupporterChildSponsorship> {
  // Filter by supporterId
  if (filterDto?.supporterId) {
    qb.andWhere(`${alias}.supporterId = :supporterId`, {
      supporterId: filterDto.supporterId,
    });
  }

  // Filter by familyMemberId
  if (filterDto?.familyMemberId) {
    qb.andWhere(`${alias}.familyMemberId = :familyMemberId`, {
      familyMemberId: filterDto.familyMemberId,
    });
  }

  // Filter by sponsorshipStatus
  if (filterDto?.sponsorshipStatus) {
    qb.andWhere(`${alias}.sponsorshipStatus = :sponsorshipStatus`, {
      sponsorshipStatus: filterDto.sponsorshipStatus,
    });
  }

  // Filter by sponsorshipStartDate (greater than or equal)
  if (filterDto?.sponsorshipStartDate) {
    qb.andWhere(`${alias}.sponsorshipStartDate >= :sponsorshipStartDate`, {
      sponsorshipStartDate: filterDto.sponsorshipStartDate,
    });
  }

  // Filter by sponsorshipEndDate (less than or equal)
  if (filterDto?.sponsorshipEndDate) {
    qb.andWhere(`${alias}.sponsorshipEndDate <= :sponsorshipEndDate`, {
      sponsorshipEndDate: filterDto.sponsorshipEndDate,
    });
  }

  return qb;
}
