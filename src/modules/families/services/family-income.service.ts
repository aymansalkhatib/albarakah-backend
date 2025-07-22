import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFamilyIncomeDto } from '../dtos/requests/create-family-income.dto';
import { FamilyIncome } from '../entities/family-income.entity';
import { FamiliesService } from './families.service';
import { FamilyIncomeRepository } from '../repositories/family-income.repository';

@Injectable()
export class FamilyIncomeService {
  constructor(
    private readonly familyIncomeRepository: FamilyIncomeRepository,
    private readonly familiesService: FamiliesService,
  ) {}

  async findAll(): Promise<FamilyIncome[]> {
    return this.familyIncomeRepository.find({
      relations: ['family'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<FamilyIncome> {
    const familyIncome = await this.familyIncomeRepository.findOneById(id);
    if (!familyIncome) {
      throw new NotFoundException('Family income record not found');
    }
    return familyIncome;
  }

  async findByFamilyId(familyId: number): Promise<FamilyIncome[]> {
    await this.validateFamilyExists(familyId);
    return this.familyIncomeRepository.findByFamilyId(familyId);
  }

  async findByFamilyIdAndDateRange(
    familyId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<FamilyIncome[]> {
    await this.validateFamilyExists(familyId);
    return this.familyIncomeRepository.findByFamilyIdAndDateRange(familyId, startDate, endDate);
  }

  async findByIncomeSource(incomeSource: string): Promise<FamilyIncome[]> {
    return this.familyIncomeRepository.findByIncomeSource(incomeSource);
  }

  async create(createFamilyIncomeDto: CreateFamilyIncomeDto): Promise<FamilyIncome> {
    await this.validateFamilyExists(createFamilyIncomeDto.familyId);
    return this.familyIncomeRepository.createFamilyIncome(createFamilyIncomeDto);
  }

  async update(id: number, updateData: Partial<CreateFamilyIncomeDto>): Promise<FamilyIncome> {
    const familyIncome = await this.findOne(id);

    if (updateData.familyId) {
      await this.validateFamilyExists(updateData.familyId);
    }

    return this.familyIncomeRepository.updateFamilyIncome(id, updateData);
  }

  async delete(id: number): Promise<void> {
    const familyIncome = await this.findOne(id);
    await this.familyIncomeRepository.deleteFamilyIncome(id);
  }

  async forceDelete(id: number): Promise<void> {
    const familyIncome = await this.findOne(id);
    await this.familyIncomeRepository.forceDeleteFamilyIncome(id);
  }

  async getTotalIncomeByFamilyId(familyId: number): Promise<number> {
    await this.validateFamilyExists(familyId);
    return this.familyIncomeRepository.getTotalIncomeByFamilyId(familyId);
  }

  async getTotalIncomeByFamilyIdAndDateRange(
    familyId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    await this.validateFamilyExists(familyId);
    return this.familyIncomeRepository.getTotalIncomeByFamilyIdAndDateRange(
      familyId,
      startDate,
      endDate,
    );
  }

  private async validateFamilyExists(familyId: number): Promise<void> {
    try {
      await this.familiesService.findOne(familyId);
    } catch (error) {
      throw new NotFoundException('Family not found');
    }
  }
}
