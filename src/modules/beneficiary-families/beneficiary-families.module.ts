import { Module } from '@nestjs/common';
import { BeneficiaryFamiliesController } from './beneficiary-families.controller';
import { BeneficiaryFamiliesService } from './beneficiary-families.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BeneficiaryFamily } from './entities/beneficiary-families.entity';
import { BeneficiaryFamilyRepository } from './beneficiary-family.repository';
import { FamilyMember } from './entities/family-members.entity';
import { FamilyIncome } from './entities/family-income.entity';
import { FamilyMemberRepository } from './family-member.repository';
import { FamilyIncomeRepository } from './family-income.repository';
import { FamilyMembersService } from './family-members.service';
import { FamilyIncomeService } from './family-income.service';
import { FamilyMembersController } from './family-members.controller';
import { FamilyIncomeController } from './family-income.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BeneficiaryFamily, FamilyMember, FamilyIncome])],
  controllers: [BeneficiaryFamiliesController, FamilyMembersController, FamilyIncomeController],
  providers: [
    BeneficiaryFamiliesService,
    BeneficiaryFamilyRepository,
    FamilyMembersService,
    FamilyMemberRepository,
    FamilyIncomeService,
    FamilyIncomeRepository,
  ],
  exports: [BeneficiaryFamiliesService, FamilyMembersService, FamilyIncomeService],
})
export class BeneficiaryFamiliesModule {}
