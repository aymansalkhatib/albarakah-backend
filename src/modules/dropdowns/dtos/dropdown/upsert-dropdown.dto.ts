import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';
import { DropdownSelectionType } from '../../enums/dropdown-selection-type.enum';
import { UpsertDropdownOptionDto } from '../dropdown-option/create-dropdown-option.dto';

export class UpsertDropdownDto {
  @IsOptional()
  @PositiveIntegerId()
  id?: number;

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
