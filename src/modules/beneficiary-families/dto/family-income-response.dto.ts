import { Expose, Type } from 'class-transformer';
import { CreateFamilyIncomeDto } from './create-family-income.dto';
import { BeneficiaryFamilyResponseDto } from './beneficiary-family-response.dto';

export class FamilyIncomeResponseDto extends CreateFamilyIncomeDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => BeneficiaryFamilyResponseDto)
  family: BeneficiaryFamilyResponseDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
