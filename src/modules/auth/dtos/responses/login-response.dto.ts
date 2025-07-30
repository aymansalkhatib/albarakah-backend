import { Exclude, Expose, Type } from 'class-transformer';
import { SystemUser } from '../../../system-users/entities/system-user.entity';

@Exclude()
export class LoginResponseDto {
  @Expose()
  accessToken: string;

  @Expose()
  @Type(() => SystemUser)
  user: SystemUser;
}
