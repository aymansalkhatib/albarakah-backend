import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateDropdownCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @Expose()
  name: string;

  @IsOptional()
  @Expose()
  parentId?: number;
}