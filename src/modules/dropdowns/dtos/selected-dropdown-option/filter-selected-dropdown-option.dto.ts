import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { PositiveIntegerId } from 'src/common/decorators/positive-integer-id.decorator';

export class FilterSelectedDropdownOptionDto extends PaginationDto {
  @IsOptional()
  @PositiveIntegerId()
  recordId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  recordType?: string;

  @IsOptional()
  @PositiveIntegerId()
  dropdownId?: number;

  @IsOptional()
  @PositiveIntegerId()
  selectedOptionId?: number;
}
