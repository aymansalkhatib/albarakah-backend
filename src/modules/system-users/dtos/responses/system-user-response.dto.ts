import { Exclude, Expose, Type } from 'class-transformer';
import { EmployeeResponseDto } from '../../../employees/dtos/responses/employee-response.dto';
import { RoleResponseDto } from '@app/modules/roles/dtos/responses/role-response.dto';

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
  @Type(() => RoleResponseDto)
  role?: RoleResponseDto;
}
