import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
// import { PersonService } from './person.service';
// import { PersonController } from './person.controller';
import { FilterModule } from 'src/common/filters/filter.module';
import { ErrorHandlerFactory } from 'src/shared/exceptions-filter/error-handler.factory';
import { WinstonLoggerService } from 'src/shared/modules/app-logging/winston-logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([Person]), FilterModule],
  // controllers: [PersonController],
  // providers: [PersonService, ErrorHandlerFactory, WinstonLoggerService],
  // exports: [PersonService],
})
export class PersonModule {}
