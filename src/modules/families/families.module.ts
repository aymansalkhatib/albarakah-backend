import { Module } from '@nestjs/common';
import { FamiliesController } from './controllers/families.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Family } from './entities/families.entity';
import { FamiliesService } from './services/families.service';

@Module({
  imports: [TypeOrmModule.forFeature([Family])],
  controllers: [FamiliesController],
  providers: [FamiliesService],
  exports: [FamiliesService],
})
export class FamiliesModule {}
