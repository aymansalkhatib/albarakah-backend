import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyIncome } from './entities/family-income.entity';
import { FamilyIncomeService } from './services/family-income.service';
import { FamilyIncomeController } from './controllers/family-income.controller';
import { FamiliesModule } from '../families/families.module';
import { FamilyIncomeRepository } from './repositories/family-income.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FamilyIncome]), FamiliesModule],
  controllers: [FamilyIncomeController],
  providers: [FamilyIncomeService, FamilyIncomeRepository],
  exports: [FamilyIncomeService],
})
export class FamiliesIncomeModule {}
