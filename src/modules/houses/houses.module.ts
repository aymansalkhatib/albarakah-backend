import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HousesController } from './controllers/houses.controller';
import { HousesService } from './services/houses.service';
import { House } from './entities/house.entity';
import { FamiliesModule } from '../families/families.module';

@Module({
  imports: [TypeOrmModule.forFeature([House]), FamiliesModule],
  controllers: [HousesController],
  providers: [HousesService],
  exports: [HousesService],
})
export class HousesModule {}
