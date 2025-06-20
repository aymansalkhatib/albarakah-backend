import { Expose, Type } from 'class-transformer';
import { ResponseDropdownDto } from '../dropdown/response-dropdown.dto';
import { ResponseDecoratorOptions } from '@nestjs/common';
import { ResponseDropdownOptionDto } from '../dropdown-option/response-dropdown-option.dto';

export class ResponseSelectedDropdownOptionDto {
  @Expose()
  id: number;

  @Expose()
  recordId: number;

  @Expose()
  recordType: string;

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
