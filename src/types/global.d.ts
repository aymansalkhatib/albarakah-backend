import { SystemUser } from '../modules/system-users/entities/system-user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: SystemUser;
      roles?: string[] | string;
    }
  }
}

export {};
