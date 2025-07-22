import { FamilyResponseDto } from '@app/modules/families/dtos/responses/family-response.dto';
import { FamilyRelationType } from '@app/modules/families/enums/family-relation-type.enum';
import { Person } from '@app/modules/persons/entities/person.entity';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class ResponseGuardianDto {
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
  @Type(() => Person)
  person?: Person;

  @Expose()
  @Type(() => FamilyResponseDto)
  family?: FamilyResponseDto;
}
