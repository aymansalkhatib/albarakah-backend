import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemUser } from './entities/system-user.entity';
import { SystemUsersController } from './system-users.controller';
import { EmployeesModule } from '../employees/entities/employee.module';
import { SystemUsersService } from './system-users.service';

@Module({
  imports: [TypeOrmModule.forFeature([SystemUser]), EmployeesModule],
  controllers: [SystemUsersController],
  providers: [SystemUsersService],
  exports: [SystemUsersService],
})
export class SystemUsersModule {}
