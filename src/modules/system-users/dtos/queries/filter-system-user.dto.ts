import 'reflect-metadata';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FilterRoleDto } from '../../../roles/dto/query/filter-role.dto';
import { FilterEmployeeDto } from '@app/modules/employees/dtos/queries/filter-employee.dto';

export class FilterSystemUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsNumber()
  roleId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterRoleDto)
  role?: FilterRoleDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterEmployeeDto)
  employee?: FilterEmployeeDto;
}
