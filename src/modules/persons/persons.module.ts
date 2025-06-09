import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { PersonsService } from './persons.service';

@Module({
  imports: [TypeOrmModule.forFeature([Person])],
  controllers: [],
  providers: [PersonsService],
  exports: [PersonsService],
})
export class PersonsModule {}
