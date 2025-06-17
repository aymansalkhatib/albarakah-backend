import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './entities/roles.entity';
import { RolePermission } from './entities/role-permission.entity';
import { PermissionEntity } from './entities/permissions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, PermissionEntity, RolePermission])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
