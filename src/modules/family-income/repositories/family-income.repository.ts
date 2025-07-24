import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CreateFamilyIncomeDto } from '../dtos/requests/create-family-income.dto';
import { FamilyIncome } from '../entities/family-income.entity';

@Injectable()
export class FamilyIncomeRepository extends Repository<FamilyIncome> {
  constructor(
    @InjectRepository(FamilyIncome)
    private readonly repository: Repository<FamilyIncome>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findOneById(id: number): Promise<FamilyIncome | undefined> {
    return this.findOne({
      where: { id },
      relations: ['family'],
    });
  }

  async findByFamilyId(familyId: number): Promise<FamilyIncome[]> {
    return this.find({
      where: { familyId },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByFamilyIdAndDateRange(
    familyId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<FamilyIncome[]> {
    return this.find({
      where: {
        familyId,
        createdAt: Between(startDate, endDate),
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByIncomeSource(incomeSource: string): Promise<FamilyIncome[]> {
    return this.find({
      where: { incomeSource },
      relations: ['family'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async createFamilyIncome(createFamilyIncomeDto: CreateFamilyIncomeDto): Promise<FamilyIncome> {
    const familyIncome = this.create(createFamilyIncomeDto);
    return this.save(familyIncome);
  }

  async updateFamilyIncome(
    id: number,
    updateData: Partial<CreateFamilyIncomeDto>,
  ): Promise<FamilyIncome> {
    await this.update(id, updateData);
    return this.findOneById(id);
  }

  async deleteFamilyIncome(id: number): Promise<void> {
    await this.delete(id);
  }

  async getTotalIncomeByFamilyId(familyId: number): Promise<number> {
    const result = await this.createQueryBuilder('income')
      .select('SUM(income.amount)', 'total')
      .where('income.familyId = :familyId', { familyId })
      .getRawOne();
    return result?.total || 0;
  }

  async getTotalIncomeByFamilyIdAndDateRange(
    familyId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const result = await this.createQueryBuilder('income')
      .select('SUM(income.amount)', 'total')
      .where('income.familyId = :familyId', { familyId })
      .andWhere('income.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();
    return result?.total || 0;
  }
}
