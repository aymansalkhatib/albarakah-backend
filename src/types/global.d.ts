import { Role } from '../modules/roles/entities/roles.entity';
import { UserPermission } from '../modules/roles/entities/user-permission.entity';
import { DecodedAccessTokenPayload } from '../shared/modules/app-jwt/interfaces';

declare global {
  namespace Express {
    interface Request {
      user?: SystemUser;
    }
  }
}
