import { OmitType, PartialType } from '@nestjs/mapped-types';

import { CreateEmployeeDto } from './create-employee.dto';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { UpdatePersonDto } from '../../persons/dtos/requests/update-person.dto';

export class UpdateEmployeeDto extends PartialType(
  OmitType(CreateEmployeeDto, ['person', 'personId'] as const),
) {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePersonDto)
  person?: UpdatePersonDto;
}
