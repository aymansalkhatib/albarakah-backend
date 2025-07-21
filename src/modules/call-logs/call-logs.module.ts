import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallLog } from './entities/call-log.entity';
import { Person } from '../persons/entities/person.entity';
import { Employee } from '../employees/entities/employee.entity';
import { CallLogsController } from './controllers/call-logs.controller';
import { CallLogsService } from './services/call-logs.service';
import { GuardiansModule } from '../guardians/guardians.module';
import { SupportersModule } from '../supporters/supporters.module';
import { BeneficiaryFamiliesModule } from '../beneficiary-families/beneficiary-families.module';
import { EmployeesModule } from '../employees/employee.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CallLog]),
    GuardiansModule,
    SupportersModule,
    EmployeesModule,
    BeneficiaryFamiliesModule,
  ],
  controllers: [CallLogsController],
  providers: [CallLogsService],
  exports: [CallLogsService],
})
export class CallLogsModule {}
