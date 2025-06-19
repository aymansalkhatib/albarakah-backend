import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';

export class UpdateDropdownCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @Expose()
  name: string;
}
