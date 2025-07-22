import { Expose, Type } from 'class-transformer';
import { CreateFamilyIncomeDto } from '../requests/create-family-income.dto';
import { FamilyResponseDto } from './family-response.dto';

export class FamilyIncomeResponseDto extends CreateFamilyIncomeDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => FamilyResponseDto)
  family: FamilyResponseDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
