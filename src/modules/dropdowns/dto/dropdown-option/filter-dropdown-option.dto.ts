import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { PositiveIntegerId } from 'src/common/decorators/positive-integer-id.decorator';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';

export class FilterDropdownOptionDto extends PaginationDto {
  @IsOptional()
  @PositiveIntegerId()
  dropdownId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}
