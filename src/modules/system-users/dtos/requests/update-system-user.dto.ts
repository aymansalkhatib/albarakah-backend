import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { CreateSystemUserDto } from './create-system-user.dto';
import { UpdateEmployeeDto } from '@app/modules/employees/dtos/requests/update-employee.dto';

export class UpdateSystemUserDto extends PartialType(
  OmitType(CreateSystemUserDto, ['employee', 'employeeId'] as const),
) {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateEmployeeDto)
  employee?: UpdateEmployeeDto;
}
