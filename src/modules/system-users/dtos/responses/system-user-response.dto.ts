import { Exclude, Expose, Type } from 'class-transformer';
import { EmployeeResponseDto } from '../../../employees/dtos/responses/employee-response.dto';
import { ResponseRoleDto } from '../../../roles/dto/response/response-role.dto';

@Exclude()
export class SystemUserResponseDto {
  @Expose()
  id: number;

  @Expose()
  roleId?: number;

  @Expose()
  username: string;

  @Expose()
  lastLogin?: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  employeeId?: number;

  @Expose()
  @Type(() => EmployeeResponseDto)
  employee?: EmployeeResponseDto;

  @Expose()
  @Type(() => ResponseRoleDto)
  role?: ResponseRoleDto;
}
