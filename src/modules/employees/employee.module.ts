import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonsModule } from '../persons/persons.module';
import { EmployeesController } from './controllers/employee.controller';
import { Employee } from './entities/employee.entity';
import { EmployeesService } from './services/employee.service';

@Module({
  imports: [TypeOrmModule.forFeature([Employee]), PersonsModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
