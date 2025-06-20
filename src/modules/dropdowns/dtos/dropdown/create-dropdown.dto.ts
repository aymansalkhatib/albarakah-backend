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
import { PositiveIntegerId } from 'src/common/decorators/positive-integer-id.decorator';

export class CreateDropdownDto {
  @PositiveIntegerId()
  dropdownCategoryId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  dropdownName: string;

  @IsEnum(DropdownSelectionType)
  @IsOptional()
  selectionType?: DropdownSelectionType = DropdownSelectionType.SINGLE;

  @IsBoolean()
  @IsOptional()
  allowDuplicates?: boolean = false;
}
