import { Module } from '@nestjs/common';
import { FamiliesController } from './controllers/beneficiary-families.controller';
 import { TypeOrmModule } from '@nestjs/typeorm';
import { Family } from './entities/families.entity';
 import { FamilyMember } from './entities/family-members.entity';
import { FamilyIncome } from './entities/family-income.entity';
 
import { FamilyMembersService } from './services/family-members.service';
import { FamilyIncomeService } from './services/family-income.service';
import { FamilyIncomeController } from './controllers/family-income.controller';
import { FamilyMembersController } from './controllers/family-members.controller';
import { FamilyIncomeRepository } from './repositories/family-income.repository';
import { FamilyMemberRepository } from './repositories/family-member.repository';
import { FamiliesService } from './services/beneficiary-families.service';
import { FamilyRepository } from './repositories/family.repository';
 

@Module({
  imports: [TypeOrmModule.forFeature([Family, FamilyMember, FamilyIncome])],
  controllers: [FamiliesController, FamilyMembersController, FamilyIncomeController],
  providers: [
    FamiliesService,
    FamilyRepository,
    FamilyMembersService,
    FamilyMemberRepository,
    FamilyIncomeService,
    FamilyIncomeRepository,
  ],
  exports: [FamiliesService, FamilyMembersService, FamilyIncomeService],
})
export class BeneficiaryFamiliesModule {}
