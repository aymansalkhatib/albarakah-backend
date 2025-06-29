import { IsOptional, IsString } from 'class-validator';
import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';
import { PaginationDto } from '@app/common/pagination/dto/pagination.dto';

export class FilterPermissionDto extends PaginationDto {
  @IsOptional()
  @PositiveIntegerId({ nullable: true })
  id?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @PositiveIntegerId({ nullable: true })
  roleId?: number;
}
