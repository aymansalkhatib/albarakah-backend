import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserAccountDto } from './create-user-account.dto';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { UpdateEmployeeDto } from 'src/modules/employees/dto/update-employee.dto';

export class UpdateUserAccountDto extends PartialType(
  OmitType(CreateUserAccountDto, ['employee', 'employeesId'] as const),
) {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateEmployeeDto)
  employee?: UpdateEmployeeDto;
}
