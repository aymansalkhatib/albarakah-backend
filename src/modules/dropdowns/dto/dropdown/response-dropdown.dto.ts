import { Expose, Type } from 'class-transformer';
import { DropdownSelectionType } from '../../entities/dropdown.entity';
import { ResponseDropdownCategoryDto } from '../dropdown-category/response-dropdown-category.dto';
import { ResponseDropdownOptionDto } from '../dropdown-option/response-dropdown-option.dto';

// Optionally import related DTOs if needed

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
  allowDuplicates: boolean;

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
