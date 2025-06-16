import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportersService } from './supporters.service';
import { SupportersController } from './supporters.controller';
import { Supporter } from './entities/supporters.entity';
import { PersonsModule } from '../persons/persons.module';
import { SupporterChildSponsorship } from './entities/supporters-children.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supporter, SupporterChildSponsorship]), PersonsModule],
  controllers: [SupportersController],
  providers: [SupportersService],
  exports: [SupportersService],
})
export class SupportersModule {}
