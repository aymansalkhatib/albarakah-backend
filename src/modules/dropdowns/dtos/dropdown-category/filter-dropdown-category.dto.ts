import { IsString, IsOptional, ValidateIf, Min } from 'class-validator';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { PositiveIntegerId } from 'src/common/decorators/positive-integer-id.decorator';

export class FilterDropdownCategoryDto extends PaginationDto {
  @IsOptional()
  @PositiveIntegerId({ nullable: true })
  parentId?: number | null;

  @IsString()
  @IsOptional()
  name?: string;
}
