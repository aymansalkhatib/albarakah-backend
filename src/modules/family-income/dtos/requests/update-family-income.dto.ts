import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateFamilyIncomeDto } from './create-family-income.dto';

export class UpdateFamilyIncomeDto extends PartialType(
  PickType(CreateFamilyIncomeDto, ['familyId', 'notes', 'amount', 'incomeSource']),
) {}
