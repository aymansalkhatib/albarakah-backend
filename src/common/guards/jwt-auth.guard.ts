import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AppJwtService } from '../../shared/modules/app-jwt/app-jwt.service';
import { DecodedAccessTokenPayload } from '../../shared/modules/app-jwt/interfaces';
import { SystemUsersService } from '@app/modules/system-users/services/system-users.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: AppJwtService,
    private readonly systemUsersService: SystemUsersService,
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
    const user = await this.systemUsersService.findOne(payload.userId);

    // Attach user info to request for use in controllers
    request.user = user;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
