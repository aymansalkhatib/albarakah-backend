import { Exclude, Expose, Type } from 'class-transformer';
import { PermissionResponseDto } from './permission-response.dto';

@Exclude()
export class ResponseRoleDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  @Type(() => PermissionResponseDto)
  permissions?: PermissionResponseDto[];
}
