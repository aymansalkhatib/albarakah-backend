import { IsOptional, IsString } from 'class-validator';
import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';

export class FilterRoleDto {
  @IsOptional()
  @PositiveIntegerId({ nullable: true })
  id?: number;

  @IsOptional()
  @IsString()
  name?: string;
}
