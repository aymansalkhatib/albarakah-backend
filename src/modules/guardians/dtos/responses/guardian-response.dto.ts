import { PersonResponseDto } from '../../../persons/dtos/responses/person-response.dto';
import { FamilyResponseDto } from '../../../families/dtos/responses/family-response.dto';
import { FamilyRelationType } from '../../../family-members/enums/family-relation-type.enum';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class GuardianResponseDto {
  @Expose()
  id: number;

  @Expose()
  personId?: number;

  @Expose()
  relationType?: FamilyRelationType;

  @Expose()
  notes?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => PersonResponseDto)
  person?: PersonResponseDto;

  @Expose()
  @Type(() => FamilyResponseDto)
  family?: FamilyResponseDto;
}
