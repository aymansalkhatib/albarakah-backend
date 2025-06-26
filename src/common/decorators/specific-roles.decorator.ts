import { SetMetadata } from '@nestjs/common';

export const SPECIFIC_PERMISSIONS_KEY = 'specific-permissions';
export const SpecificRoles = (permission: number[]) => SetMetadata(SPECIFIC_PERMISSIONS_KEY, permission);
