import { BeneficiaryFamiliesModule } from './modules/beneficiary-families/beneficiary-families.module';
import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppLoggerModule } from './shared/modules/app-logging/app-logger.module';
import { AppLoggerMiddleware } from './shared/modules/app-logging/app-logger.middleware';
import { WinstonLoggerService } from './shared/modules/app-logging/winston-logger.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorHandlerFactory } from './shared/exceptions-filter/error-handler.factory';
import { GlobalExceptionFilter } from './shared/exceptions-filter/global-exception.filter';
// import { NotificationModule } from './services/notifications/notification.module';
import { AppI18nModule } from './shared/modules/app-i18n/i18n.module';
import { AppConfigModel } from './shared/modules/app-config/app_config.module';
import { AppTypeOrmModule } from './shared/modules/app-type-orm/app-type-orm.module';
import { EmployeesModule } from './modules/employees/entities/employee.module';
import { SystemUsersModule } from './modules/users/system-users.module';
import { DropdownsModule } from './modules/dropdowns/dropdowns.module';

// import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    AppConfigModel,
    AppLoggerModule,
    // NotificationModule,
    AppI18nModule,
    AppTypeOrmModule,
    // AppStorageModule.register({ provider: 'local' }),
    // MailModule,

    // AppJwtModule,
    // AuthModule,
    DropdownsModule,
    BeneficiaryFamiliesModule,
    EmployeesModule,
    SystemUsersModule,
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
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*all');
  }
}
