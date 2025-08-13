import { IsNotEmpty } from 'class-validator';
import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';
import { StrictBoolean } from '../../../../common/decorators/strict-boolean.decorator';

export class AssignUserPermissionDto {
  @IsNotEmpty()
  @PositiveIntegerId()
  systemUserId: number;

  @IsNotEmpty()
  @PositiveIntegerId()
  permissionId: number;

  @StrictBoolean()
  isAllowed: boolean;
}
