import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { PositiveIntegerId } from 'src/common/decorators/positive-integer-id.decorator';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { StrictBoolean } from 'src/common/decorators/strict-boolean.decorator';

export class FilterDropdownOptionDto extends PaginationDto {
  @IsOptional()
  @PositiveIntegerId()
  dropdownId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @StrictBoolean()
  isActive?: boolean;
}
