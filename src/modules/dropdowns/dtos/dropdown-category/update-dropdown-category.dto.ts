import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateDropdownCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;
}
