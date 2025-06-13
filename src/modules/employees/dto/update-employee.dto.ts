import { OmitType, PartialType } from '@nestjs/mapped-types';

import { CreateEmployeeDto } from './create-employee.dto';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { ValidateNested } from 'class-validator';
import { UpdatePersonDto } from 'src/modules/persons/dto/update-person.dto';

export class UpdateEmployeeDto extends PartialType(
  OmitType(CreateEmployeeDto, ['person', 'personId'] as const),
) {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePersonDto)
  person?: UpdatePersonDto;
}
