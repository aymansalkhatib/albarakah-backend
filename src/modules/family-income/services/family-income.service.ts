import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFamilyIncomeDto } from '../dtos/requests/create-family-income.dto';
import { FamilyIncome } from '../entities/family-income.entity';
import { FamiliesService } from '@app/modules/families/services/families.service';
import { FamilyIncomeRepository } from '../repositories/family-income.repository';
import { FilterFamilyIncomeDto } from '../dtos/queries/filter-family-income.dto';
import { PaginationResponseDto } from '@app/common/pagination/dto/pagination-response.dto';
import { paginate } from '@app/common/pagination/paginate.service';
import { TranslateHelper } from '@app/shared/modules/app-i18n/translate.helper';
import { FamilyIncomeResponseDto } from '../dtos/responses/family-income-response.dto';

@Injectable()
export class FamilyIncomeService {
  constructor(
    private readonly familyIncomeRepository: FamilyIncomeRepository,
    private readonly familiesService: FamiliesService,
    private readonly translateHelper: TranslateHelper,
  ) {}

  async findAll(
    filterDto: FilterFamilyIncomeDto,
  ): Promise<PaginationResponseDto<FamilyIncomeResponseDto>> {
    const qb = this.familyIncomeRepository
      .createQueryBuilder('familyIncome')
      .leftJoinAndSelect('familyIncome.family', 'family')
      .orderBy('familyIncome.createdAt', 'DESC');

    if (filterDto.familyId) {
      qb.andWhere('familyIncome.familyId = :familyId', { familyId: filterDto.familyId });
    }
    if (filterDto.incomeSource) {
      qb.andWhere('familyIncome.incomeSource LIKE :incomeSource', {
        incomeSource: `%${filterDto.incomeSource}%`,
      });
    }
    if (filterDto.minAmount) {
      qb.andWhere('familyIncome.amount >= :minAmount', { minAmount: filterDto.minAmount });
    }
    if (filterDto.maxAmount) {
      qb.andWhere('familyIncome.amount <= :maxAmount', { maxAmount: filterDto.maxAmount });
    }
    if (filterDto.notes) {
      qb.andWhere('familyIncome.notes LIKE :notes', { notes: `%${filterDto.notes}%` });
    }
    if (filterDto.startDate) {
      qb.andWhere('familyIncome.createdAt >= :startDate', {
        startDate: new Date(filterDto.startDate),
      });
    }
    if (filterDto.endDate) {
      qb.andWhere('familyIncome.createdAt <= :endDate', { endDate: new Date(filterDto.endDate) });
    }

    return paginate<FamilyIncome, FamilyIncomeResponseDto>(qb, filterDto, FamilyIncomeResponseDto);
  }

  async findOne(id: number): Promise<FamilyIncome> {
    const familyIncome = await this.familyIncomeRepository.findOneById(id);
    if (!familyIncome) {
      throw new NotFoundException(
        this.translateHelper.tr('family-income.errors.not_found', { id }),
      );
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
    await this.findOne(id);

    if (updateData.familyId) {
      await this.validateFamilyExists(updateData.familyId);
    }

    return this.familyIncomeRepository.updateFamilyIncome(id, updateData);
  }

  async delete(id: number): Promise<void> {
    await this.findOne(id);
    await this.familyIncomeRepository.deleteFamilyIncome(id);
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
    const family = await this.familiesService.findOne(familyId);
    if (!family)
      throw new NotFoundException(
        this.translateHelper.tr('family-income.errors.not_found', { id: familyId }),
      );
  }
}
