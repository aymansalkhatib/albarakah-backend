import { IsArray, IsBoolean, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';

export class UserPermissionItemDto {
  @IsNotEmpty()
  @PositiveIntegerId()
  permissionId: number;

  @IsNotEmpty()
  @IsBoolean()
  isAllowed: boolean;
}

export class BulkAssignUserPermissionsDto {
  @IsNotEmpty()
  @PositiveIntegerId()
  systemUserId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserPermissionItemDto)
  permissions: UserPermissionItemDto[];
}
