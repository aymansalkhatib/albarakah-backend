import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Permission } from '../../enums/permission.enum';

export class FilterPermissionDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  id?: number;

  @IsOptional()
  @IsEnum(Permission)
  name?: Permission;

  @IsOptional()
  @IsString()
  search?: string;
}
