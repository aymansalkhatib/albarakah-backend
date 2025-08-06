import { SponsorshipStatus } from '../../enums/sponsorship-status.enum';

export class SupporterChildSponsorshipResponseDto {
  id: number;
  supporterId: number;
  familyMemberId: number;
  sponsorshipStartDate: Date;
  sponsorshipEndDate?: Date;
  sponsorshipStatus: SponsorshipStatus;
  createdAt: Date;
  updatedAt: Date;
  supporter?: {
    id: number;
    supportStartDate: Date;
    supportEndDate?: Date;
    supportType?: string;
    notes?: string;
  };
  familyMember?: {
    id: number;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: string;
    relationType: string;
  };
}
