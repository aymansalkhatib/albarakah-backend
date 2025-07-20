import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { PermissionResponseDto } from './permission-response.dto';

@Exclude()
export class RoleResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose({ name: 'permissions' })
  @Transform(
    ({ obj }) => {
      const permissions = (obj.rolePermissions ?? []).map((e: { permission: any }) => e.permission);
      return permissions.length > 0 ? permissions : undefined;
    },
    { toClassOnly: true },
  )
  @Type(() => PermissionResponseDto)
  rolePermissions?: PermissionResponseDto[];
}
