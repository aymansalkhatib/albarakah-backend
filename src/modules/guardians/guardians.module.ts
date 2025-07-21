import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardiansService } from './guardians.service';
import { GuardiansController } from './guardians.controller';
import { Guardian } from './entities/guardian.entity';
import { PersonsModule } from '../persons/persons.module';

@Module({
  imports: [TypeOrmModule.forFeature([Guardian]),PersonsModule],
  controllers: [GuardiansController],
  providers: [GuardiansService],
  exports: [GuardiansService],
})
export class GuardiansModule {}
