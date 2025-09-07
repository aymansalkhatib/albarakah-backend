import { Expose } from 'class-transformer';
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
  @Expose()
  familyId?: number;

  @IsOptional()
  @IsDate()
  @Expose()
  visitDateFrom?: Date;

  @IsOptional()
  @IsDate()
  @IsLessThanOrEqual('visitDateFrom', {
    message: 'visitDateTo must be greater than or equal to visitDateFrom',
  })
  @Expose()
  visitDateTo?: Date;

  @IsOptional()
  @IsDate()
  @Expose()
  paperSentDateFrom?: Date;

  @IsOptional()
  @IsDate()
  @IsLessThanOrEqual('paperSentDateFrom', {
    message:
      'paperSentDateTo must be greater than or equal to paperSentDateFrom',
  })
  @Expose()
  paperSentDateTo?: Date;

  @IsOptional()
  @IsEnum(FamilyRelationType)
  @Expose()
  guardianRelationship?: FamilyRelationType;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  @Expose()
  numberOfFamilyMembersMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  @IsLessThanOrEqual('numberOfFamilyMembersMin', {
    message:
      'numberOfFamilyMembersMax must be greater than or equal to numberOfFamilyMembersMin',
  })
  @Expose()
  numberOfFamilyMembersMax?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  @Expose()
  numberOfRemainingFamilyMembersMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  @IsLessThanOrEqual('numberOfRemainingFamilyMembersMin', {
    message:
      'numberOfRemainingFamilyMembersMax must be greater than or equal to numberOfRemainingFamilyMembersMin',
  })
  @Expose()
  numberOfRemainingFamilyMembersMax?: number;

  @IsOptional()
  @IsEnum(HouseCondition)
  @Expose()
  houseCondition?: HouseCondition;

  @IsOptional()
  @IsEnum(HouseOwnership)
  @Expose()
  houseOwnership?: HouseOwnership;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  @Expose()
  schoolExpensesMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  @IsLessThanOrEqual('schoolExpensesMin', {
    message:
      'schoolExpensesMax must be greater than or equal to schoolExpensesMin',
  })
  @Expose()
  schoolExpensesMax?: number;

  @IsOptional()
  @IsEnum(AlBarakaCharityIncomeAmount)
  @Expose()
  barakaAssociationIncome?: AlBarakaCharityIncomeAmount;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  @Expose()
  availableSpendingMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  @IsLessThanOrEqual('availableSpendingMin', {
    message:
      'availableSpendingMax must be greater than or equal to availableSpendingMin',
  })
  @Expose()
  availableSpendingMax?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  @Expose()
  totalIncomeMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  @IsLessThanOrEqual('totalIncomeMin', {
    message: 'totalIncomeMax must be greater than or equal to totalIncomeMin',
  })
  @Expose()
  totalIncomeMax?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  @Expose()
  rentAmountMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  @IsLessThanOrEqual('rentAmountMin', {
    message: 'rentAmountMax must be greater than or equal to rentAmountMin',
  })
  @Expose()
  rentAmountMax?: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  @Expose()
  committeeMemberName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Expose()
  searchNotes?: string;
}
