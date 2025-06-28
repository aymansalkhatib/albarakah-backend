import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { ResponseRoleDto } from './response-role.dto';
import { UserPermission } from '../../entities/user-permission.entity';
import { PermissionEntity } from '../../entities/permissions.entity';

@Exclude()
export class PermissionResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

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
  @Type(() => ResponseRoleDto)
  roles?: ResponseRoleDto[];
}
