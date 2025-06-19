import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { DropdownSelectionType } from '../../entities/dropdown.entity';

export class CreateDropdownDto {
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  dropdownCategoryId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Expose()
  dropdownName: string;

  @IsEnum(DropdownSelectionType)
  @IsOptional()
  @Expose()
  selectionType?: DropdownSelectionType = DropdownSelectionType.SINGLE;

  @IsBoolean()
  @IsOptional()
  @Expose()
  allowDuplicates?: boolean = false;
}
