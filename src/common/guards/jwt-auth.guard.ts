import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Request } from 'express';
import { AppJwtService } from '../../shared/modules/app-jwt/app-jwt.service';
import { SystemUsersService } from '../../modules/system-users/system-users.service';
import { DecodedAccessTokenPayload } from '../../shared/modules/app-jwt/interfaces';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: AppJwtService,
    private moduleRef: ModuleRef,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Access token is required');
    }

    // Verify the token
    const payload: DecodedAccessTokenPayload = this.jwtService.verifyAccessToken(token);

    // Check if user exists and is active
    const systemUsersService = this.moduleRef.get(SystemUsersService, { strict: false });

    const user = await systemUsersService.findOne(payload.userId);

    // Attach user info to request for use in controllers
    request.user = user;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
