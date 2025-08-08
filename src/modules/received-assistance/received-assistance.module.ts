import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceivedAssistance } from './entities/received-assistance.entity';
import { ReceivedAssistanceService } from './services/received-assistance.service';
import { ReceivedAssistanceController } from './controllers/received-assistance.controller';
import { FamiliesModule } from '../families/families.module';
import { FamilyMembersModule } from '../family-members/family-members.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReceivedAssistance]), FamiliesModule, FamilyMembersModule],
  controllers: [ReceivedAssistanceController],
  providers: [ReceivedAssistanceService],
  exports: [ReceivedAssistanceService],
})
export class ReceivedAssistanceModule {}
