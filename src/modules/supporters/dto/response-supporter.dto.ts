import { Exclude, Expose, Type } from 'class-transformer';
import { Person } from '../../persons/entities/person.entity';
import { SupportType } from '../enums/support-type';

@Exclude()
export class ResponseSupporterDto {
  @Expose()
  id: number;

  @Expose()
  personId: number;

  @Expose()
  supportStartDate: string;

  @Expose()
  supportEndDate?: string;

  @Expose()
  supportType?: SupportType;

  @Expose()
  notes?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => Person)
  person?: Person;
}
