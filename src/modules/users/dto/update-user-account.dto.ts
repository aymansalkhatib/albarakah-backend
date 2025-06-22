import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { UpdateEmployeeDto } from 'src/modules/employees/dto/update-employee.dto';
import { CreateSystemUserDto } from './create-system-user.dto';

export class UpdateSystemUserDto extends PartialType(
  OmitType(CreateSystemUserDto, ['employee', 'employeeId'] as const),
) {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateEmployeeDto)
  employee?: UpdateEmployeeDto;
}
