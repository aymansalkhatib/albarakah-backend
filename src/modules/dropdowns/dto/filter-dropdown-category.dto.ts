import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class FilterDropdownCategoryDto {
  @IsNumber()
  @IsOptional()
  @Expose()
  parentId?: number;

  @IsString()
  @IsOptional()
  @Expose()
  name?: string;
}