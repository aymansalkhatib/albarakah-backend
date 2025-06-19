import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { DropdownSelectionType } from '../../entities/dropdown.entity';
import { PositiveIntegerId } from 'src/common/decorators/positive-integer-id.decorator';

export class FilterDropdownDto extends PaginationDto {
  @IsOptional()
  @PositiveIntegerId()
  dropdownCategoryId?: number;

  @IsString()
  @IsOptional()
  dropdownName?: string;

  @IsOptional()
  @IsEnum(DropdownSelectionType)
  selectionType?: DropdownSelectionType;
}
