import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { PositiveIntegerId } from 'src/common/decorators/positive-integer-id.decorator';

export class FilterDropdownCategoryDto extends PaginationDto {
  @IsOptional()
  @PositiveIntegerId({ nullable: true })
  parentId?: number | null;

  @IsString()
  @IsOptional()
  name?: string;
}
