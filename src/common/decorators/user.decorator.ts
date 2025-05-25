import { createParamDecorator, ExecutionContext } from '@nestjs/common';
//TODO: CHANGE TO USER RESPONSE DTO INSTEAD OF USER ENTITY
// import { UserResponseDto } from 'src/modules/auth/dto/response';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext): any | undefined => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return user;
  },
);
