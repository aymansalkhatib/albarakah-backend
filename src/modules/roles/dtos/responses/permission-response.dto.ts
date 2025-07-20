import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { RoleResponseDto } from './role-response.dto';

@Exclude()
export class PermissionResponseDto {
  @Expose()
  id: number;

  @Expose()
  name?: string;

  @Expose()
  description?: string;

  @Expose({ name: 'roles' })
  @Transform(
    ({ obj }) => {
      const roles = (obj.rolePermissions ?? []).map((e: { role: any }) => e.role);
      return roles.length > 0 ? roles : undefined;
    },
    { toClassOnly: true },
  )
  @Type(() => RoleResponseDto)
  roles?: RoleResponseDto[];
}
