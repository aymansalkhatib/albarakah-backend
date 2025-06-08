import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './employee.entity';
import { EmployeesController } from '../employee.controller';
import { EmployeesService } from '../employee.service';
import { Person } from '../../persons/entities/person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Person])],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
