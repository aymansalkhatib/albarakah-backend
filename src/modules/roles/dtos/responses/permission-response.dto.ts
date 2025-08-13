import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { RoleResponseDto } from './role-response.dto';
import { Permission } from '../../enums/permission.enum';

@Exclude()
export class PermissionResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: Permission;

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
