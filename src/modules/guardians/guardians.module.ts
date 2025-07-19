import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardiansService } from './services/guardians.service';
import { GuardiansController } from './controllers/guardians.controller';
import { Guardian } from './entities/guardian.entity';
import { PersonsModule } from '../persons/persons.module';

@Module({
  imports: [TypeOrmModule.forFeature([Guardian]), PersonsModule],
  controllers: [GuardiansController],
  providers: [GuardiansService],
  exports: [GuardiansService],
})
export class GuardiansModule {}
