import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../modules/roles/enums/role.enum';

export const SPECIFIC_ROLES_KEY = 'specific-roles';
export const SpecificRoles = (roles: UserRole[]) => SetMetadata(SPECIFIC_ROLES_KEY, roles);
