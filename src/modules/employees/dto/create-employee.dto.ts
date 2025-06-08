import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreatePersonDto } from '../../persons/dto/create-person.dto';
import { Type } from 'class-transformer';
import { OnlyOneOf } from 'src/common/decorators/validate-one-of-two-fields.validator';

@OnlyOneOf(['personId', 'person'])
export class CreateEmployeeDto { 
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

  @IsOptional()
  @IsNumber()
  personId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePersonDto)
  person?: CreatePersonDto;
}
