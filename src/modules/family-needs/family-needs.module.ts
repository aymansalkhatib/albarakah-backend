import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyNeed } from './entities/family-need.entity';
import { FamilyNeedsController } from './controllers/family-needs.controller';
import { FamilyNeedsService } from './services/family-needs.service';
import { FamiliesModule } from '../families/families.module';
import { FamilyMembersModule } from '../family-members/family-members.module';

@Module({
  imports: [TypeOrmModule.forFeature([FamilyNeed]), FamiliesModule, FamilyMembersModule],
  controllers: [FamilyNeedsController],
  providers: [FamilyNeedsService],
  exports: [FamilyNeedsService],
})
export class FamilyNeedsModule {}
