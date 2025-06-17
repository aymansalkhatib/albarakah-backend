import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesService } from '../../modules/roles/roles.service';
import { PERMISSIONS_KEY } from '../decorators/required-permissions.decorator';
import { SPECIFIC_ROLES_KEY } from '../decorators/specific-roles.decorator';
import { UserRole } from '../../modules/roles/enums/role.enum';

@Injectable()
export class SpecificRolePermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rolesService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // الحصول على الأدوار المحددة المطلوبة
    const specificRoles = this.reflector.get<UserRole[]>(SPECIFIC_ROLES_KEY, context.getHandler());

    // الحصول على الصلاحيات المطلوبة
    const requiredPermissions = this.reflector.get<string[]>(PERMISSIONS_KEY, context.getHandler());

    // إذا لم يتم تحديد أي أدوار أو صلاحيات، نسمح بالوصول
    if (
      (!specificRoles || specificRoles.length === 0) &&
      (!requiredPermissions || requiredPermissions.length === 0)
    ) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // تأكد من وجود المستخدم وأدواره
    if (!user || !user.roles || !Array.isArray(user.roles)) {
      throw new UnauthorizedException('المستخدم غير مصرح له');
    }

    // التحقق من الأدوار المحددة إذا كانت مطلوبة
    if (specificRoles && specificRoles.length > 0) {
      // نتحقق فقط من الأدوار المحددة، وليس من التسلسل الهرمي
      const hasSpecificRole = user.roles.some((role) => specificRoles.includes(role));
      if (!hasSpecificRole) {
        throw new UnauthorizedException('ليس لديك الدور المطلوب للوصول');
      }
    }

    // التحقق من الصلاحيات المطلوبة إذا كانت مطلوبة
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasAllPermissions = await this.rolesService.hasAllPermissions(
        user.roles,
        requiredPermissions,
      );
      if (!hasAllPermissions) {
        throw new UnauthorizedException('ليس لديك الصلاحيات المطلوبة');
      }
    }

    return true;
  }
}
