import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallLogsService } from './call-logs.service';
import { CallLogsController } from './call-logs.controller';
import { CallLog } from './entities/call-log.entity';
import { Person } from '../persons/entities/person.entity';
import { Employee } from '../employees/entities/employee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CallLog, Person, Employee])
  ],
  controllers: [CallLogsController],
  providers: [CallLogsService],
  exports: [CallLogsService],
})
export class CallLogsModule {}