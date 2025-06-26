import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { PersonsService } from './services/persons.service';
import { PersonController } from './controllers/person.controller';
import { DropdownsModule } from '../dropdowns/dropdowns.module';

@Module({
  imports: [DropdownsModule, TypeOrmModule.forFeature([Person])],
  controllers: [PersonController],
  providers: [PersonsService],
  exports: [PersonsService],
})
export class PersonsModule {}
