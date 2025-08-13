import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../../common/pagination/dto/pagination.dto';

export class FilterRoleDto extends PaginationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
