import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SystemUserResponseDto {
  @Expose()
  id: number;

  @Expose()
  employeesId?: number;

  @Expose()
  roleId?: number;

  @Expose()
  username: string;

  @Expose()
  lastLogin?: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
