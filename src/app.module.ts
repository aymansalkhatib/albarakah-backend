import { FamiliesModule } from './modules/families/families.module';
import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorHandlerFactory } from './shared/exceptions-filter/error-handler.factory';
import { GlobalExceptionFilter } from './shared/exceptions-filter/global-exception.filter';
import { AppI18nModule } from './shared/modules/app-i18n/i18n.module';
import { AppConfigModel } from './shared/modules/app-config/app_config.module';
import { AppTypeOrmModule } from './shared/modules/app-type-orm/app-type-orm.module';
import { SystemUsersModule } from './modules/system-users/system-users.module';
import { DropdownsModule } from './modules/dropdowns/dropdowns.module';
import { AppJwtModule } from './shared/modules/app-jwt/app-jwt.module';
import { RolesModule } from './modules/roles/roles.module';
import { AuthModule } from './modules/auth/auth.module';
import { TrainingCoursesModule } from './modules/training-courses/training-courses.module';
import { GuardiansModule } from './modules/guardians/guardians.module';
import { EmployeesModule } from './modules/employees/employee.module';
import { ParseQueryMiddleware } from './common/middlewares/parse-query.middleware';
import { CallLogsModule } from './modules/call-logs/call-logs.module';
import { FamiliesIncomeModule } from './modules/family-income/family-income.module';
import { FamilyMembersModule } from './modules/family-members/family-members.module';
import { EmergencyAidRequestModule } from './modules/emergency-aid-request/emergency-aid-request.module';
import { FamilyNeedsModule } from './modules/family-needs/family-needs.module';
import { ReceivedAssistanceModule } from './modules/received-assistance/received-assistance.module';

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
    FamiliesIncomeModule,
    EmployeesModule,
    SystemUsersModule,
    RolesModule,
    TrainingCoursesModule,
    GuardiansModule,
    CallLogsModule,
    FamilyMembersModule,
    EmergencyAidRequestModule,
    FamilyNeedsModule,
    ReceivedAssistanceModule,
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
