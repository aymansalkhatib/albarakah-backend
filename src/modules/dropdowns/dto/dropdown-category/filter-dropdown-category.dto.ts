import { IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';
import { Expose } from 'class-transformer';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';

export class FilterDropdownCategoryDto extends PaginationDto {
  @IsNumber()
  @IsOptional()
  @Expose()
  parentId?: number | null;

  @IsString()
  @IsOptional()
  @Expose()
  name?: string;
}
