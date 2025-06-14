import { IsOptional, IsString, IsNumber, IsBoolean, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { FilterRoleDto } from 'src/modules/roles/dto/filter-role.dto';
import { FilterEmployeeDto } from 'src/modules/employees/dto/filter-employee.dto';

export class FilterSystemUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
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
