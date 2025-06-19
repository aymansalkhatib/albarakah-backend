import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesService } from '../../modules/roles/roles.service';
import { PERMISSIONS_KEY } from '../decorators/required-permissions.decorator';

@Injectable()
export class RolePermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rolesService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(PERMISSIONS_KEY, context.getHandler());

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // تأكد من وجود المستخدم وأدواره
    if (!user || !user.roles || !Array.isArray(user.roles)) {
      throw new UnauthorizedException('المستخدم غير مصرح له');
    }

    // التحقق من وجود جميع الصلاحيات المطلوبة
    const hasAllPermissions = await this.rolesService.hasAllPermissions(
      user.roles,
      requiredPermissions,
    );

    if (!hasAllPermissions) {
      throw new UnauthorizedException('ليس لديك الصلاحيات المطلوبة');
    }

    return true;
  }
}
