import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamiliesModule } from '../families/families.module';
import { EmergencyAidRequestController } from './controllers/emergency-aid-request.controller';
import { EmergencyAidRequest } from './entities/emergency-aid-request.entity';
import { EmergencyAidRequestService } from './services/emergency-aid-request.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmergencyAidRequest]), FamiliesModule],
  controllers: [EmergencyAidRequestController],
  providers: [EmergencyAidRequestService],
  exports: [EmergencyAidRequestService],
})
export class EmergencyAidRequestModule {}
