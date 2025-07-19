import { BeneficiaryFamilyResponseDto } from '@app/modules/beneficiary-families/dto/beneficiary-family-response.dto';
import { FamilyRelationType } from '@app/modules/beneficiary-families/enums/family-relation-type.enum';
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
  @Type(() => BeneficiaryFamilyResponseDto)
  family?: BeneficiaryFamilyResponseDto;
}
