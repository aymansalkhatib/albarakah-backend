import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  MaxLength,
  IsDateString,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { CreatePersonDto } from 'src/modules/persons/dto/create-person.dto';
import { UpdatePersonDto } from 'src/modules/persons/dto/update-person.dto';

export class UpdateEmployeeDto {
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
  @ValidateNested()
  @Type(() => UpdatePersonDto)
  person?: UpdatePersonDto;
}
