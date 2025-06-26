import { OmitType, PartialType } from '@nestjs/mapped-types';

 import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { CreateEmployeeDto } from './create-employee.dto';
import { UpdatePersonDto } from '@app/modules/persons/dtos/requests/update-person.dto';
 
export class UpdateEmployeeDto extends PartialType(
  OmitType(CreateEmployeeDto, ['person', 'personId'] as const),
) {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePersonDto)
  person?: UpdatePersonDto;
}
