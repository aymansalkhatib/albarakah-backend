import { Expose, Type } from 'class-transformer';

export class ResponseDropdownOptionDto {
  @Expose()
  id: number;

  @Expose()
  dropdownId: number;

  @Expose()
  name: string;

  @Expose()
  @Type(() => Date)
  createdAt: Date;
}
