import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateFamilyIncomeDto } from './create-family-income.dto';

export class UpdateFamilyIncomeDto extends PartialType(
  OmitType(CreateFamilyIncomeDto, ['familyId']),
) {}
