import { Exclude, Expose, Type } from 'class-transformer';
import { SponsorshipStatus } from '../../enums/sponsorship-status.enum';
import { SupporterResponseDto } from '../responses/supporter-response.dto';
import { FamilyMemberResponseDto } from '@app/modules/family-members/dtos/responses/family-member-response.dto';
import { SupporterChildSponsorship } from '../../entities/supporters-children.entity';

export class SupporterChildSponsorshipResponseDto {
  @Expose()
  id: number;

  @Expose()
  supporterId: number;

  @Expose()
  familyMemberId: number;

  @Expose()
  sponsorshipStartDate: Date;

  @Expose()
  sponsorshipEndDate?: Date;

  @Expose()
  sponsorshipStatus: SponsorshipStatus;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => SupporterResponseDto)
  supporter?: SupporterResponseDto;

  @Expose()
  @Type(() => FamilyMemberResponseDto)
  familyMember?: FamilyMemberResponseDto;
}
