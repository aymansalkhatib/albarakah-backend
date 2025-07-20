import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemUser } from './entities/system-user.entity';
import { EmployeesModule } from '../employees/employee.module';
import { SystemUsersController } from './controllers/system-users.controller';
import { SystemUsersService } from './services/system-users.service';

@Module({
  imports: [TypeOrmModule.forFeature([SystemUser]), EmployeesModule],
  controllers: [SystemUsersController],
  providers: [SystemUsersService],
  exports: [SystemUsersService],
})
export class SystemUsersModule {}
