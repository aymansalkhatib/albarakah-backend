import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { RolesModule } from '../../../modules/roles/roles.module';
import { SystemUsersModule } from '../../../modules/system-users/system-users.module';
import { EnvironmentConfig } from '../app-config/env.schema';
import { AppJwtService } from './app-jwt.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService<EnvironmentConfig>) => ({
        secret: configService.get('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_EXPIRES_IN_MS'),
        },
      }),
      inject: [ConfigService],
    }),
    SystemUsersModule,
    RolesModule,
  ],
  exports: [
    AppJwtService,
    SystemUsersModule,
    RolesModule,
    JwtAuthGuard,
    PermissionsGuard,
  ],
  providers: [AppJwtService, JwtAuthGuard, PermissionsGuard],
})
export class AppJwtModule {}
