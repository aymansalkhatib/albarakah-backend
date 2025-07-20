import { SystemUser } from '@app/modules/system-users/entities/system-user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): SystemUser => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;
    return user;
  },
);
