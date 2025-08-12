import { Expose, Transform, Type } from 'class-transformer';
import { PersonResponseDto } from '../../../../modules/persons/dtos/responses/person-response.dto';
import { ReceivedAssistance } from '../../../../modules/received-assistance/entities/received-assistance.entity';
import { FamilyRelationType } from '../../enums/family-relation-type.enum';
import { PersonCourseBatchResponseDto } from '../../../../modules/training-courses/dtos/responses/person-course-batch-response.dto';
import { FamilyResponseDto } from '../../../../modules/families/dtos/responses/family-response.dto';
import { SupporterResponseDto } from '../../../../modules/supporters/dtos/responses/supporter-response.dto';
import { SupporterChildSponsorshipResponseDto } from '@app/modules/supporters/dtos/responses/supporter-child-sponsorship-response.dto';

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
  isSponsored: boolean;

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

  //TODO change to dto
  @Expose()
  @Type(() => ReceivedAssistance)
  receivedAssistance: ReceivedAssistance[];

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
