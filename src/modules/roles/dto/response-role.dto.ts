import { Exclude, Expose } from 'class-transformer';
import { SystemUserResponseDto } from 'src/modules/users/dto/system-user-response.dto';

@Exclude()
export class ResponseRoleDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  //TODO
  rolePermissions?: any[];

  @Expose()
  systemUsers?: SystemUserResponseDto[];
}
