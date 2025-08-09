import { Exclude, Expose, Type } from 'class-transformer';
import { PersonResponseDto } from '../../../../modules/persons/dtos/responses/person-response.dto';
import { SupportType } from '../../enums/support-type';

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
