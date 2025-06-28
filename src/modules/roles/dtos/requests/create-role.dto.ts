import { ArrayUnique, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PositiveIntegerIdArray } from '../../../../common/decorators/positive-integer-id-array.decorator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ArrayUnique()
  @PositiveIntegerIdArray()
  permissionIds?: number[];
}
