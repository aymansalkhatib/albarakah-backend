import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { IsLessThanOrEqual } from '../../../../common/decorators/is-less-than-or-equal.decorator';
import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';
import { PaginationDto } from '../../../../common/pagination/dto/pagination.dto';
import { FamilyRelationType } from '../../../family-members/enums/family-relation-type.enum';
import { HouseCondition, HouseOwnership } from '../../enums';
import { AlBarakaCharityIncomeAmount } from '../../enums/al-baraka-charity-income-amount.enum';

export class FilterVisitDto extends PaginationDto {
  @IsOptional()
  @PositiveIntegerId()
  familyId?: number;

  @IsOptional()
  @IsDate()
  visitDateFrom?: Date;

  @IsOptional()
  @IsDate()
  @IsLessThanOrEqual('visitDateFrom', {
    message: 'visitDateTo must be greater than or equal to visitDateFrom',
  })
  visitDateTo?: Date;

  @IsOptional()
  @IsDate()
  paperSentDateFrom?: Date;

  @IsOptional()
  @IsDate()
  @IsLessThanOrEqual('paperSentDateFrom', {
    message:
      'paperSentDateTo must be greater than or equal to paperSentDateFrom',
  })
  paperSentDateTo?: Date;

  @IsOptional()
  @IsEnum(FamilyRelationType)
  guardianRelationship?: FamilyRelationType;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  numberOfFamilyMembersMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  @IsLessThanOrEqual('numberOfFamilyMembersMin', {
    message:
      'numberOfFamilyMembersMax must be greater than or equal to numberOfFamilyMembersMin',
  })
  numberOfFamilyMembersMax?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  numberOfRemainingFamilyMembersMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  @IsLessThanOrEqual('numberOfRemainingFamilyMembersMin', {
    message:
      'numberOfRemainingFamilyMembersMax must be greater than or equal to numberOfRemainingFamilyMembersMin',
  })
  numberOfRemainingFamilyMembersMax?: number;

  @IsOptional()
  @IsEnum(HouseCondition)
  houseCondition?: HouseCondition;

  @IsOptional()
  @IsEnum(HouseOwnership)
  houseOwnership?: HouseOwnership;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  schoolExpensesMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  @IsLessThanOrEqual('schoolExpensesMin', {
    message:
      'schoolExpensesMax must be greater than or equal to schoolExpensesMin',
  })
  schoolExpensesMax?: number;

  @IsOptional()
  @IsEnum(AlBarakaCharityIncomeAmount)
  barakaAssociationIncome?: AlBarakaCharityIncomeAmount;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  availableSpendingMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  @IsLessThanOrEqual('availableSpendingMin', {
    message:
      'availableSpendingMax must be greater than or equal to availableSpendingMin',
  })
  availableSpendingMax?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  totalIncomeMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @IsLessThanOrEqual('totalIncomeMin', {
    message: 'totalIncomeMax must be greater than or equal to totalIncomeMin',
  })
  totalIncomeMax?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  rentAmountMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  @IsLessThanOrEqual('rentAmountMin', {
    message: 'rentAmountMax must be greater than or equal to rentAmountMin',
  })
  rentAmountMax?: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  committeeMemberName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  searchNotes?: string;
}
