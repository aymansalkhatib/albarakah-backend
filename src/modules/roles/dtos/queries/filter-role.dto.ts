import { IsOptional, IsString } from 'class-validator';
import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';
import { PaginationDto } from '../../../../common/pagination/dto/pagination.dto';

export class FilterRoleDto extends PaginationDto {
  @IsOptional()
  @PositiveIntegerId({ nullable: true })
  id?: number;

  @IsOptional()
  @IsString()
  name?: string;
}
