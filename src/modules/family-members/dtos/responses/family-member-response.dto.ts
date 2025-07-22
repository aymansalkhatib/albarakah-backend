import { Expose, Type } from 'class-transformer';
import { PersonResponseDto } from '@app/modules/persons/dtos/responses/person-response.dto';
import { CreateFamilyMemberDto } from '../requests/create-family-member.dto';
import { FamilyResponseDto } from '@app/modules/families/dtos/responses/family-response.dto';

export class FamilyMemberResponseDto extends CreateFamilyMemberDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => PersonResponseDto)
  person: PersonResponseDto;

  @Expose()
  @Type(() => FamilyResponseDto)
  family: FamilyResponseDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
