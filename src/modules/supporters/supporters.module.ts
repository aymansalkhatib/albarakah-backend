import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
 import { Supporter } from './entities/supporters.entity';
import { PersonsModule } from '../persons/persons.module';
import { SupporterChildSponsorship } from './entities/supporters-children.entity';
import { SupportersService } from './services/supporters.service';
import { SupportersController } from './controllers/supporters.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Supporter, SupporterChildSponsorship]), PersonsModule],
  controllers: [SupportersController],
  providers: [SupportersService],
  exports: [SupportersService],
})
export class SupportersModule {}
