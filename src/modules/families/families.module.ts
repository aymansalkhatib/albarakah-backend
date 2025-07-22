import { Module } from '@nestjs/common';
import { FamiliesController } from './controllers/families.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Family } from './entities/families.entity';
import { FamiliesService } from './services/families.service';
import { FamilyRepository } from './repositories/family.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Family])],
  controllers: [FamiliesController],
  providers: [FamiliesService, FamilyRepository],
  exports: [FamiliesService],
})
export class FamiliesModule {}
