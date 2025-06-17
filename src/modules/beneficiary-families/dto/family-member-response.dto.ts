import { Expose, Type } from 'class-transformer';
import { CreateFamilyMemberDto } from './create-family-member.dto';
import { PersonResponseDto } from '../../persons/dto/person-response.dto';
import { BeneficiaryFamilyResponseDto } from './beneficiary-family-response.dto';

export class FamilyMemberResponseDto extends CreateFamilyMemberDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => PersonResponseDto)
  person: PersonResponseDto;

  @Expose()
  @Type(() => BeneficiaryFamilyResponseDto)
  family: BeneficiaryFamilyResponseDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  deletedAt?: Date;
}
