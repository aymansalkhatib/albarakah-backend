import { Expose, Transform, Type } from 'class-transformer';
import { PermissionResponseDto } from './permission-response.dto';

export class RoleResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  @Transform(
    ({ obj }) => {
      const permissions = (obj.rolePermissions ?? []).map((e: { permission: any }) => e.permission);
      return permissions.length > 0 ? permissions : undefined;
    },
    { toClassOnly: true },
  )
  @Type(() => PermissionResponseDto)
  permissions?: PermissionResponseDto[];
}
