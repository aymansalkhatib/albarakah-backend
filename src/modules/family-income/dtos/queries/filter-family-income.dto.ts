import { IsOptional, IsNumber, IsString, Min, MaxLength, IsNotEmpty, Max } from 'class-validator';
import { PaginationQueryDto } from '../../../../common/pagination/dto/pagination-query.dto';
import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';
import { ValidateMinMaxPairs } from '../../../../common/decorators/validate-min-max-pairs-constraint';

@ValidateMinMaxPairs()
export class FilterFamilyIncomeDto extends PaginationQueryDto {
  @IsOptional()
  @PositiveIntegerId()
  familyId?: number;

  @IsOptional()
  @PositiveIntegerId()
  familyMemberId?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  incomeSource?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minAmount?: number;

  @IsOptional()
  @IsNumber()
  @Max(1_000_000_000)
  maxAmount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
