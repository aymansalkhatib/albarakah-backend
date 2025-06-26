import { Expose, Type } from 'class-transformer';
import { ResponseDropdownDto } from '../dropdown/response-dropdown.dto';
import { ResponseDropdownOptionDto } from '../dropdown-option/response-dropdown-option.dto';

export class ResponseSelectedDropdownOptionDto {
  @Expose()
  id: number;

  @Expose()
  recordId: number;

  @Expose()
  entityType: string;

  @Expose()
  dropdownId: number;

  @Expose()
  selectedOptionId: number;

  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @Expose()
  @Type(() => Date)
  updatedAt: Date;

  @Expose()
  @Type(() => ResponseDropdownDto)
  dropdown?: ResponseDropdownDto;

  @Expose()
  @Type(() => ResponseDropdownOptionDto)
  selectedOption?: ResponseDropdownOptionDto;
}
