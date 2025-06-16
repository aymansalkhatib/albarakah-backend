import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateDropdownOptionDto {
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  dropdownId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Expose()
  name: string;
}