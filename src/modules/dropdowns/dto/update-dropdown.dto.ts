import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { DropdownSelectionType } from '../entities/dropdown.entity';

export class UpdateDropdownDto {
  @IsNumber()
  @IsOptional()
  @Expose()
  dropdownCategoryId?: number;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  @Expose()
  dropdownName?: string;

  @IsEnum(DropdownSelectionType)
  @IsOptional()
  @Expose()
  selectionType?: DropdownSelectionType;

  @IsBoolean()
  @IsOptional()
  @Expose()
  allowDuplicates?: boolean;
}