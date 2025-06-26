import { createParamDecorator, ExecutionContext } from '@nestjs/common';
//TODO: CHANGE TO USER RESPONSE DTO INSTEAD OF USER ENTITY
// import { UserResponseDto } from '../../modules/auth/dtos/responses';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext): any | undefined => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return user;
  },
);
