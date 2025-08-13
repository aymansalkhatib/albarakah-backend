import { Permission } from '../enums/permission.enum';

export const PROTECTED_ROLE_NAME = 'superadmin';

export function isProtectedRoleName(roleName?: string | null): boolean {
  return (roleName ?? '').toLowerCase() === PROTECTED_ROLE_NAME.toLowerCase();
}
