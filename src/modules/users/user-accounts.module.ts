import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccountsService } from './services/user-accounts.service';
import { UserAccountsController } from './controllers/user-accounts.controller';
import { UserAccount } from './entities/user-accounts.entity';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccount]), EmployeesModule],
  controllers: [UserAccountsController],
  providers: [UserAccountsService],
  exports: [UserAccountsService],
})
export class UserAccountsModule {}
