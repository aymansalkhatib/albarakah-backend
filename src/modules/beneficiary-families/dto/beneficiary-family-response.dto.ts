import { CreateBeneficiaryFamilyDto } from './create-beneficiary-family-dto';
import { Expose } from 'class-transformer';
import { IsUUID, IsDateString } from 'class-validator';

export class BeneficiaryFamilyResponseDto extends CreateBeneficiaryFamilyDto {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @IsDateString()
  createdAt: Date;

  @Expose()
  @IsDateString()
  updatedAt: Date;
}
