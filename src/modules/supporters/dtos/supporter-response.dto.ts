import { Exclude, Expose, Type } from 'class-transformer';
import { Person } from '../../persons/entities/person.entity';
import { SupportType } from '../enums/support-type';
import { PersonResponseDto } from '@app/modules/persons/dtos/responses/person-response.dto';

@Exclude()
export class SupporterResponseDto {
  @Expose()
  id: number;

  @Expose()
  personId: number;

  @Expose()
  supportStartDate: Date;

  @Expose()
  supportEndDate?: Date;

  @Expose()
  supportType?: SupportType;

  @Expose()
  notes?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => PersonResponseDto)
  person?: PersonResponseDto;
}
