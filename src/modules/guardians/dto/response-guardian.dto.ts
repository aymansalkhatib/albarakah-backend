import { FamilyRelationType } from '../../beneficiary-families/enums/family-relation-type.enum';
import { Exclude, Expose, Type } from 'class-transformer';
import { Person } from '../../persons/entities/person.entity';
import { BeneficiaryFamily } from '../../beneficiary-families/entities/beneficiary-families.entity';

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
