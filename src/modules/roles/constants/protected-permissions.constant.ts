export const PROTECTED_ROLE_NAME = 'Superadmin';

export function isProtectedRoleName(roleName?: string | null): boolean {
  return (roleName ?? '').toLowerCase() === PROTECTED_ROLE_NAME.toLowerCase();
}
