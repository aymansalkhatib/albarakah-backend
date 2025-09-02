import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParseQueryMiddleware } from './common/middlewares/parse-query.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { DropdownsModule } from './modules/dropdowns/dropdowns.module';
import { EmergencyAidRequestModule } from './modules/emergency-aid-request/emergency-aid-request.module';
import { EmployeesModule } from './modules/employees/employee.module';
import { FamiliesModule } from './modules/families/families.module';
import { FamilyMembersModule } from './modules/family-members/family-members.module';
import { FamilyNeedsModule } from './modules/family-needs/family-needs.module';
import { ReceivedAssistanceModule } from './modules/received-assistance/received-assistance.module';
import { RolesModule } from './modules/roles/roles.module';
import { SystemUsersModule } from './modules/system-users/system-users.module';
import { TrainingCoursesModule } from './modules/training-courses/training-courses.module';
import { VisitsModule } from './modules/visits/visits.module';
import { ErrorHandlerFactory } from './shared/exceptions-filter/error-handler.factory';
import { GlobalExceptionFilter } from './shared/exceptions-filter/global-exception.filter';
import { AppConfigModel } from './shared/modules/app-config/app_config.module';
import { AppI18nModule } from './shared/modules/app-i18n/i18n.module';
import { AppJwtModule } from './shared/modules/app-jwt/app-jwt.module';
import { AppTypeOrmModule } from './shared/modules/app-type-orm/app-type-orm.module';

@Module({
  imports: [
    AppConfigModel,
    AppI18nModule,
    AppTypeOrmModule,
    AppJwtModule,
    //
    AuthModule,
    DropdownsModule,
    FamiliesModule,
    FamilyMembersModule,
    EmployeesModule,
    SystemUsersModule,
    RolesModule,
    TrainingCoursesModule,
    FamilyMembersModule,
    EmergencyAidRequestModule,
    FamilyNeedsModule,
    ReceivedAssistanceModule,
    VisitsModule,
  ],

  controllers: [AppController],

  providers: [
    AppService,
    ErrorHandlerFactory,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ParseQueryMiddleware).forRoutes('*');
  }
}
