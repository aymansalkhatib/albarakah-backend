import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamiliesModule } from '../families/families.module';
import { EmergencyAidController } from './controllers/emergency-aid.controller';
import { EmergencyAidRequest } from './entities/emergency-aid-request.entity';
import { EmergencyAidService } from './services/emergency-aid.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmergencyAidRequest]), FamiliesModule],
  controllers: [EmergencyAidController],
  providers: [EmergencyAidService],
  exports: [EmergencyAidService],
})
export class EmergencyAidModule {}
