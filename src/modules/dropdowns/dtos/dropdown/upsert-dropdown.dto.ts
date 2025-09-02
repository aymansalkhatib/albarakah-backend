import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';
import { UpsertDropdownOptionDto } from '../dropdown-option/create-dropdown-option.dto';

export class UpsertDropdownDto {
  @IsOptional()
  @PositiveIntegerId()
  id?: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  dropdownName: string;

  // In UpsertDropdownDto
  @Type(() => UpsertDropdownOptionDto)
  @ValidateNested({ each: true, message: 'Each option must be valid' })
  options: UpsertDropdownOptionDto[];
}
