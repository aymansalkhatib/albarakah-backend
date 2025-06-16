import { FamilyRelationType } from 'src/modules/beneficiary-families/enums/family-relation-type.enum';
import { Exclude, Expose, Type } from 'class-transformer';
import { Person } from 'src/modules/persons/entities/person.entity';
import { BeneficiaryFamily } from 'src/modules/beneficiary-families/entities/beneficiary-families.entity';

@Exclude()
export class ResponseGuardianDto {
  @Expose()
  id: number;

  @Expose()
  personId?: number;

  @Expose()
  relationType?: FamilyRelationType;

  @Expose()
  guardianshipStartDate: string;

  @Expose()
  guardianshipEndDate?: string;

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
  @Type(() => BeneficiaryFamily)
  families?: BeneficiaryFamily[];
}
