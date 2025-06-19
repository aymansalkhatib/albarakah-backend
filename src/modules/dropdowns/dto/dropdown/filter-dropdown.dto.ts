import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { DropdownSelectionType } from '../../entities/dropdown.entity';

export class FilterDropdownDto extends PaginationDto {
  @IsNumber()
  @IsOptional()
  @Expose()
  dropdownCategoryId?: number;

  @IsString()
  @IsOptional()
  @Expose()
  dropdownName?: string;

  @IsEnum(DropdownSelectionType)
  @IsOptional()
  @Expose()
  selectionType?: DropdownSelectionType;
}
