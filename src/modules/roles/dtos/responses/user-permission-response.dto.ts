import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { PermissionResponseDto } from './permission-response.dto';

@Exclude()
export class UserPermissionResponseDto {
  @Expose()
  id: number;

  @Expose()
  systemUserId: number;

  @Expose()
  permissionId: number;

  @Expose()
  isAllowed: boolean;

  @Expose({ name: 'permission' })
  @Type(() => PermissionResponseDto)
  permission: PermissionResponseDto;
}
