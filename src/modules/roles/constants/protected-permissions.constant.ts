import { Permission } from '../enums/permission.enum';

/**
 * System User Management Permissions - Protected and cannot be modified
 * These permissions are reserved for superadmin only and cannot be added/removed through normal operations
 */
export const PROTECTED_SYSTEM_USER_PERMISSIONS: Permission[] = [
  Permission.CREATE_SYSTEM_USER,
  Permission.UPDATE_SYSTEM_USER,
  Permission.DELETE_SYSTEM_USER,
  Permission.READ_SYSTEM_USER,
] as const;

/**
 * Check if a permission is a protected system user permission
 * @param permission The permission to check
 * @returns True if the permission is protected
 */
export function isProtectedSystemUserPermission(permission: Permission): boolean {
  return PROTECTED_SYSTEM_USER_PERMISSIONS.includes(permission);
}

/**
 * Get all protected system user permissions
 * @returns Array of protected permissions
 */
export function getProtectedSystemUserPermissions(): readonly Permission[] {
  return PROTECTED_SYSTEM_USER_PERMISSIONS;
}
