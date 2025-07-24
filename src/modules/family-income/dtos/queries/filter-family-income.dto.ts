import { IsOptional, IsNumber, IsString, Min, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '@app/common/pagination/dto/pagination-query.dto';

export class FilterFamilyIncomeDto extends PaginationQueryDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  familyId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  incomeSource?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxAmount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
