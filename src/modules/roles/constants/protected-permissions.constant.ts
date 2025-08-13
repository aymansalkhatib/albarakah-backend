import { Permission } from '../enums/permission.enum';

export const PROTECTED_ROLE_NAME = 'superadmin';

export function isProtectedRoleName(roleName?: string | null): boolean {
  return (roleName ?? '').toLowerCase() === PROTECTED_ROLE_NAME.toLowerCase();
}

export const PROTECTED_SYSTEM_USER_PERMISSIONS: readonly Permission[] = [
  Permission.CREATE_SYSTEM_USER,
  Permission.UPDATE_SYSTEM_USER,
  Permission.DELETE_SYSTEM_USER,
  Permission.READ_SYSTEM_USER,
] as const;

export function isProtectedSystemUserPermission(permission: Permission): boolean {
  return PROTECTED_SYSTEM_USER_PERMISSIONS.includes(permission);
}

export function getProtectedSystemUserPermissions(): readonly Permission[] {
  return PROTECTED_SYSTEM_USER_PERMISSIONS;
}
