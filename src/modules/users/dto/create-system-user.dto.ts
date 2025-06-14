import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateEmployeeDto } from '../../employees/dto/create-employee.dto';
import { OnlyOneOf } from 'src/common/decorators/validate-one-of-two-fields.validator';

@OnlyOneOf([
  {
    fields: ['employee', 'employeeId'],
    isRequired: true,
  },
])
export class CreateSystemUserDto {
  @IsOptional()
  @IsNumber()
  employeeId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateEmployeeDto)
  employee?: CreateEmployeeDto;

  @IsNumber()
  roleId: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
