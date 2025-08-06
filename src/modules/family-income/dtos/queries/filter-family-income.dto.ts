import { IsOptional, IsNumber, IsString, Min, MaxLength, IsNotEmpty, Max } from 'class-validator';
import { PaginationQueryDto } from '@app/common/pagination/dto/pagination-query.dto';
import { PositiveIntegerId } from '@app/common/decorators/positive-integer-id.decorator';

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
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  minAmount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Max(0)
  maxAmount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
