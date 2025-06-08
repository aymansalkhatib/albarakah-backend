import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { CreatePersonDto } from '../../persons/dto/create-person.dto';

export class CreateEmployeeDto extends CreatePersonDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  position?: string;

  @IsOptional()
  @IsDateString()
  hireDate?: string;

  @IsOptional()
  @IsDateString()
  terminationDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
