import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamiliesController } from './controllers/families.controller';
import { Family } from './entities/families.entity';
import { FamiliesService } from './services/families.service';
import { EmployeesModule } from '../employees/employee.module';

@Module({
  imports: [TypeOrmModule.forFeature([Family]), EmployeesModule],
  controllers: [FamiliesController],
  providers: [FamiliesService],
  exports: [FamiliesService],
})
export class FamiliesModule {}
