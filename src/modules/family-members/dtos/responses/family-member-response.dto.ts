import { Expose, Transform, Type } from 'class-transformer';
import { FamilyResponseDto } from '../../../../modules/families/dtos/responses/family-response.dto';
import { PersonResponseDto } from '../../../../modules/persons/dtos/responses/person-response.dto';
import { PersonCourseBatchResponseDto } from '../../../../modules/training-courses/dtos/responses/person-course-batch-response.dto';
import { ReceivedAssistanceResponseDto } from '../../../received-assistance/dtos/responses/received-assistance-response.dto';
import { SupporterChildSponsorshipResponseDto } from '../../../supporters/dtos/responses/supporter-child-sponsorship-response.dto';
import { FamilyRelationType } from '../../enums/family-relation-type.enum';
import { IsPresent } from '../../enums/is-present.enum';
import { IsSponsored } from '../../enums/is-sponsored.enum';

export class FamilyMemberResponseDto {
  @Expose()
  id: number;

  @Expose()
  personId: number;

  @Expose()
  familyId: number;

  @Expose()
  relationType: FamilyRelationType;

  @Expose()
  isSponsored: IsSponsored;

  @Expose()
  memberNumber?: number;

  @Expose()
  isPresent?: IsPresent;

  @Expose()
  isGuardian: boolean;

  @Expose()
  notes?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => PersonResponseDto)
  person: PersonResponseDto;

  @Expose()
  @Type(() => FamilyResponseDto)
  family: FamilyResponseDto;

  @Expose()
  @Type(() => PersonCourseBatchResponseDto)
  courseBatches: PersonCourseBatchResponseDto[];

  @Expose()
  @Type(() => ReceivedAssistanceResponseDto)
  receivedAssistance: ReceivedAssistanceResponseDto[];

  @Expose()
  @Transform(
    ({ obj }) => {
      const courseBatches = obj.courseBatches;
      if (Array.isArray(courseBatches)) {
        return courseBatches.length > 0 ? true : false;
      }
      return null;
    },
    {
      toClassOnly: true,
    },
  )
  hasJoinedBarakaCenterCourses?: boolean;

  @Expose()
  @Transform(
    ({ obj }) => {
      const courseBatches = obj.courseBatches;
      if (Array.isArray(courseBatches)) {
        return courseBatches.length;
      }
      return null;
    },
    {
      toClassOnly: true,
    },
  )
  barakaCenterCoursesCount?: number;

  @Expose()
  @Transform(
    ({ obj }) => {
      const sponsorships = obj.childSponsorships;
      if (Array.isArray(sponsorships)) {
        return sponsorships.length > 0 ? sponsorships[0] : null;
      }
      return sponsorships ?? null;
    },
    {
      toClassOnly: true,
    },
  )
  @Type(() => SupporterChildSponsorshipResponseDto)
  sponsorship?: SupporterChildSponsorshipResponseDto;
}
