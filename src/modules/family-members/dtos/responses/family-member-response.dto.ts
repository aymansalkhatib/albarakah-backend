import { Expose, Type } from 'class-transformer';
import { PersonResponseDto } from '@app/modules/persons/dtos/responses/person-response.dto';
import { ReceivedAssistance } from '@app/modules/received-assistance/entities/received-assistance.entity';
import { FamilyRelationType } from '../../enums/family-relation-type.enum';
import { PersonCourseBatchResponseDto } from '@app/modules/training-courses/dtos/responses/person-course-batch-response.dto';
import { FamilyResponseDto } from '@app/modules/families/dtos/responses/family-response.dto';

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
}
