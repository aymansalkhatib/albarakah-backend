import { PartialType } from '@nestjs/mapped-types';
import { CreateBeneficiaryFamilyDto } from './create-beneficiary-family-dto';

export class UpdateBeneficiaryFamilyDto extends PartialType(CreateBeneficiaryFamilyDto) {}
