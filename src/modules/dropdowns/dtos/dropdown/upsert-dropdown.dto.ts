import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DropdownSelectionType } from '../../entities/dropdown.entity';
import { PositiveIntegerId } from 'src/common/decorators/positive-integer-id.decorator';
import { UpsertDropdownOptionDto } from '../dropdown-option/create-dropdown-option.dto';
import { OnlyOneOf } from 'src/common/decorators/validate-one-of-two-fields.validator';

@OnlyOneOf([{ fields: ['id', 'dropdownCategoryId'], isRequired: true }], {})
export class UpsertDropdownDto {
  @IsOptional()
  @PositiveIntegerId()
  id?: number;

  @IsOptional()
  @PositiveIntegerId()
  dropdownCategoryId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  dropdownName: string;

  @IsEnum(DropdownSelectionType)
  @IsOptional()
  selectionType?: DropdownSelectionType = DropdownSelectionType.SINGLE;

  // In UpsertDropdownDto
  @Type(() => UpsertDropdownOptionDto)
  @ValidateNested({ each: true, message: 'Each option must be valid' })
  options: UpsertDropdownOptionDto[];
}
