import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OnlyOneOf } from '../../../common/decorators/validate-one-of-two-fields.validator';
import { CreatePersonDto } from '@app/modules/persons/dtos/requests/create-person.dto';

@OnlyOneOf([
  {
    fields: ['person', 'personId'],
    isRequired: true,
  },
])
export class CreateEmployeeDto {
  @IsOptional()
  @IsString()
  @Length(3, 100)
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
  @ValidateNested()
  @Type(() => CreatePersonDto)
  person?: CreatePersonDto;

  @IsOptional()
  @IsNumber()
  personId?: number;
}
