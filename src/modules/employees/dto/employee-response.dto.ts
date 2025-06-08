import { Exclude, Expose, Type } from 'class-transformer';
import { PersonResponseDto } from '../../persons/dto/person-response.dto';

@Exclude()
export class EmployeeResponseDto {
  @Expose()
  id: number;

  @Expose()
  position: string;

  @Expose()
  hireDate: string;

  @Expose()
  terminationDate?: string;

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
