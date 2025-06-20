import { Expose, Type } from 'class-transformer';

export class ResponseDropdownCategoryDto {
  @Expose()
  id: number;

  @Expose()
  parentId?: number;

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => ResponseDropdownCategoryDto)
  children?: ResponseDropdownCategoryDto[];

  @Expose()
  @Type(() => ResponseDropdownCategoryDto)
  parent?: ResponseDropdownCategoryDto;
}
