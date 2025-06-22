import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './employee.entity';
import { EmployeesController } from '../employee.controller';
import { EmployeesService } from '../employee.service';
import { PersonsModule } from 'src/modules/persons/persons.module';

@Module({
  imports: [TypeOrmModule.forFeature([Employee]), PersonsModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
