import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../../common/pagination/dto/pagination.dto';
import { Permission } from '../../enums/permission.enum';

export class FilterPermissionDto extends PaginationDto {
  @IsOptional()
  @IsString()
  name?: Permission;

  @IsOptional()
  @IsString()
  description?: string;
}
