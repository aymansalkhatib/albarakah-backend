import { Expose, Type } from 'class-transformer';
import { ResponseDropdownOptionDto } from '../dropdown-option/response-dropdown-option.dto';

export class ResponseDropdownDto {
  @Expose()
  id: number;

  @Expose()
  dropdownName: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => ResponseDropdownOptionDto)
  options?: ResponseDropdownOptionDto[];
}
