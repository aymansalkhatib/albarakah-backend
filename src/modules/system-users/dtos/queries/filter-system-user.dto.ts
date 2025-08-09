import 'reflect-metadata';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FilterRoleDto } from '../../../../modules/roles/dtos/queries/filter-role.dto';
import { FilterEmployeeDto } from '../../../../modules/employees/dtos/queries/filter-employee.dto';
import { PaginationDto } from '../../../../common/pagination/dto/pagination.dto';

export class FilterSystemUserDto extends PaginationDto {
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
