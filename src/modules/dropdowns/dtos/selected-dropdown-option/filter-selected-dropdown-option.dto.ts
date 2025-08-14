import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationDto } from '../../../../common/pagination/dto/pagination.dto';
import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';

export class FilterSelectedDropdownOptionDto extends PaginationDto {
  @IsOptional()
  @PositiveIntegerId()
  recordId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  entityType?: string;

  @IsOptional()
  @PositiveIntegerId()
  dropdownId?: number;

  @IsOptional()
  @PositiveIntegerId()
  categoryId?: number;

  @IsOptional()
  @PositiveIntegerId()
  selectedOptionId?: number;
}
