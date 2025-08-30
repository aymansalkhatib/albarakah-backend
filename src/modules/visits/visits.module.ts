import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamiliesModule } from '../families/families.module';
import { VisitsController } from './controllers/visits.controller';
import { Visit } from './entities/visit.entity';
import { VisitsService } from './services/visits.service';

@Module({
  imports: [TypeOrmModule.forFeature([Visit]), FamiliesModule],
  controllers: [VisitsController],
  providers: [VisitsService],
  exports: [VisitsService],
})
export class VisitsModule {}
