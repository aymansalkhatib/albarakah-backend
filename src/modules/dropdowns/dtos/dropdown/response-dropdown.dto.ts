import { Expose, Type } from 'class-transformer';
import { ResponseDropdownCategoryDto } from '../dropdown-category/response-dropdown-category.dto';
import { ResponseDropdownOptionDto } from '../dropdown-option/response-dropdown-option.dto';
import { DropdownSelectionType } from '../../enums/dropdown-selection-type.enum';

export class ResponseDropdownDto {
  @Expose()
  id: number;

  @Expose()
  dropdownCategoryId: number;

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

  @Expose()
  @Type(() => ResponseDropdownCategoryDto)
  dropdownCategory?: ResponseDropdownCategoryDto;
}
