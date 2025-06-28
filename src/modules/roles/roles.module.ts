import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './services/roles.service';
import { RolesController } from './controllers/roles.controller';
import { PermissionsController } from './controllers/permissions.controller';
import { PermissionsService } from './services/permissions.service';
import { UserPermissionsController } from './controllers/user-permissions.controller';
import { UserPermissionsService } from './services/user-permissions.service';
import { Role } from './entities/roles.entity';
import { RolePermission } from './entities/role-permission.entity';
import { PermissionEntity } from './entities/permissions.entity';
import { UserPermission } from './entities/user-permission.entity';
import { SystemUser } from '../system-users/entities/system-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, PermissionEntity, RolePermission, UserPermission, SystemUser]),
  ],
  controllers: [RolesController, PermissionsController, UserPermissionsController],
  providers: [RolesService, PermissionsService, UserPermissionsService],
  exports: [RolesService, PermissionsService, UserPermissionsService],
})
export class RolesModule {}
