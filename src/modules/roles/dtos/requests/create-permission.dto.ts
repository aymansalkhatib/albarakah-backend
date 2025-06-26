import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Permission } from '../../enums/permission.enum';

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsEnum(Permission)
  name: Permission;

  @IsOptional()
  @IsString()
  description?: string;
}
