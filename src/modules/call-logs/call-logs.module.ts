import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallLog } from './entities/call-log.entity';
import { Person } from '../persons/entities/person.entity';
import { Employee } from '../employees/entities/employee.entity';
import { CallLogsController } from './controllers/call-logs.controller';
import { CallLogsService } from './services/call-logs.service';
import { GuardiansModule } from '../guardians/guardians.module';
import { SupportersModule } from '../supporters/supporters.module';
import { FamiliesModule } from '../families/families.module';
import { EmployeesModule } from '../employees/employee.module';
import { FamilyMembersModule } from '../family-members/family-members.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CallLog]),
    GuardiansModule,
    SupportersModule,
    EmployeesModule,
    FamilyMembersModule,
  ],
  controllers: [CallLogsController],
  providers: [CallLogsService],
  exports: [CallLogsService],
})
export class CallLogsModule {}
