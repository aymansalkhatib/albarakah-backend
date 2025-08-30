import { Expose, Type } from 'class-transformer';
import { DropdownSelectionType } from '../../enums/dropdown-selection-type.enum';
import { ResponseDropdownOptionDto } from '../dropdown-option/response-dropdown-option.dto';

export class ResponseDropdownDto {
  @Expose()
  id: number;

  @Expose()
  dropdownName: string;

  @Expose()
  selectionType: DropdownSelectionType;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => ResponseDropdownOptionDto)
  options?: ResponseDropdownOptionDto[];
}
