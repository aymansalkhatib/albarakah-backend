import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateDropdownSelectionDto {
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  recordId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Expose()
  recordType: string;

  @IsNumber()
  @IsOptional()
  @Expose()
  dropdownCategoryId?: number;

  @IsNumber()
  @IsOptional()
  @Expose()
  dropdownId?: number;

  @IsNumber()
  @IsOptional()
  @Expose()
  selectedOptionId?: number;
}