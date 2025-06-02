import { Module } from '@nestjs/common';
import { BeneficiaryFamiliesController } from './beneficiary-families.controller';
import { BeneficiaryFamiliesService } from './beneficiary-families.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BeneficiaryFamily } from './entities/beneficiary-families.entity';
import { BeneficiaryFamilyRepository } from './beneficiary-family.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BeneficiaryFamily])],
  controllers: [BeneficiaryFamiliesController],
  providers: [BeneficiaryFamiliesService, BeneficiaryFamilyRepository],
})
export class BeneficiaryFamiliesModule {}
