import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemUser } from '../system-users/entities/system-user.entity';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SystemUser])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
