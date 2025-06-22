import { Expose, Type } from 'class-transformer';
import { ResponseDropdownDto } from '../dropdown/response-dropdown.dto';

export class ResponseDropdownCategoryDto {
  @Expose()
  id: number;

  @Expose()
  parentId?: number;

  @Expose()
  name: string;

  @Expose()
  isSubcategoryCreationEnabled: boolean;

  @Expose()
  isDropdownCreationEnabled: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => ResponseDropdownCategoryDto)
  children?: ResponseDropdownCategoryDto[];

  @Expose()
  @Type(() => ResponseDropdownDto)
  dropdowns?: ResponseDropdownDto[];

  @Expose()
  @Type(() => ResponseDropdownCategoryDto)
  parent?: ResponseDropdownCategoryDto;
}
