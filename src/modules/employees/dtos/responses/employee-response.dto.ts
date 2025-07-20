import { PersonResponseDto } from '@app/modules/persons/dtos/responses/person-response.dto';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class EmployeeResponseDto {
  @Expose()
  id: number;

  @Expose()
  position?: string;

  @Expose()
  hireDate?: Date;

  @Expose()
  terminationDate?: Date;

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
