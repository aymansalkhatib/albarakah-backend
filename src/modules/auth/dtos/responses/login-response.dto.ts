import { Expose, Type } from 'class-transformer';
import { SystemUserResponseDto } from '../../../../modules/system-users/dtos/responses/system-user-response.dto';

export class LoginResponseDto {
  @Expose()
  accessToken: string;

  @Expose()
  @Type(() => SystemUserResponseDto)
  user: SystemUserResponseDto;
}
