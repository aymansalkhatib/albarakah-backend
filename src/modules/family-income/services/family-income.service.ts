import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateFamilyIncomeDto } from '../dtos/requests/create-family-income.dto';
import { FamilyIncome } from '../entities/family-income.entity';
import { FamiliesService } from '@app/modules/families/services/families.service';
import { FamilyIncomeRepository } from '../repositories/family-income.repository';
import { FilterFamilyIncomeDto } from '../dtos/queries/filter-family-income.dto';
import { PaginationResponseDto } from '@app/common/pagination/dto/pagination-response.dto';
import { paginate } from '@app/common/pagination/paginate.service';
import { TranslateHelper } from '@app/shared/modules/app-i18n/translate.helper';
import { FamilyIncomeResponseDto } from '../dtos/responses/family-income-response.dto';
import { FamilyMembersService } from '@app/modules/family-members/services/family-members.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { UpdateFamilyIncomeDto } from '../dtos/requests/update-family-income.dto';
import { FamilyMember } from '@app/modules/family-members/entities/family-members.entity';

@Injectable()
export class FamilyIncomeService {
  constructor(
    @InjectRepository(FamilyIncome)
    private readonly familyIncomeRepository: Repository<FamilyIncome>,
    private readonly familyMembersService: FamilyMembersService,
    private readonly familiesService: FamiliesService,
    private readonly translateHelper: TranslateHelper,
  ) {}

  async findAll(
    filterDto: FilterFamilyIncomeDto,
  ): Promise<PaginationResponseDto<FamilyIncomeResponseDto>> {
    const queryBuilder = this.familyIncomeRepository
      .createQueryBuilder('familyIncome')
      .leftJoinAndSelect('familyIncome.family', 'family')
      .leftJoinAndSelect('familyIncome.familyMember', 'familyMember');

    // Apply filters
    if (filterDto.familyId) {
      queryBuilder.andWhere('familyIncome.familyId = :familyId', {
        familyId: filterDto.familyId,
      });
    }

    if (filterDto.familyMemberId) {
      queryBuilder.andWhere('familyIncome.familyMemberId = :familyMemberId', {
        familyMemberId: filterDto.familyMemberId,
      });
    }

    if (filterDto.incomeSource) {
      queryBuilder.andWhere('familyIncome.incomeSource ILIKE :incomeSource', {
        incomeSource: `%${filterDto.incomeSource}%`,
      });
    }

    if (filterDto.minAmount !== undefined) {
      queryBuilder.andWhere('familyIncome.amount >= :minAmount', {
        minAmount: filterDto.minAmount,
      });
    }

    if (filterDto.maxAmount !== undefined) {
      queryBuilder.andWhere('familyIncome.amount <= :maxAmount', {
        maxAmount: filterDto.maxAmount,
      });
    }

    if (filterDto.notes) {
      queryBuilder.andWhere('familyIncome.notes ILIKE :notes', {
        notes: `%${filterDto.notes}%`,
      });
    }

    return paginate(queryBuilder, filterDto, FamilyIncomeResponseDto);
  }

  async findOne(id: number, options: FindOneOptions<FamilyIncome> = {}): Promise<FamilyIncome> {
    const familyIncome = await this.familyIncomeRepository.findOne({
      where: { id },
      ...options,
    });

    if (!familyIncome) {
      throw new NotFoundException(
        this.translateHelper.tr('family-income.errors.not_found', { id }),
      );
    }

    return familyIncome;
  }

  async create(createFamilyIncomeDto: CreateFamilyIncomeDto): Promise<FamilyIncome> {
    // Validate that the family exists
    const family = await this.familiesService.findOne(createFamilyIncomeDto.familyId);
    let familyMember: FamilyMember;
    // Validate that the family member exists if provided
    if (createFamilyIncomeDto.familyMemberId) {
      familyMember = await this.familyMembersService.findOne(createFamilyIncomeDto.familyMemberId);
      if (!familyMember) {
        throw new BadRequestException(
          this.translateHelper.tr('family-income.errors.family_member_not_found', {
            id: createFamilyIncomeDto.familyMemberId,
          }),
        );
      }
      // Ensure the family member belongs to the specified family
      if (familyMember.familyId !== createFamilyIncomeDto.familyId) {
        throw new BadRequestException(
          this.translateHelper.tr('family-income.errors.family_member_mismatch'),
        );
      }
    }

    const familyIncome = this.familyIncomeRepository.create(createFamilyIncomeDto);
    const savedFamilyIncome = await this.familyIncomeRepository.save(familyIncome);
    return { ...savedFamilyIncome, family, familyMember };
  }

  async update(id: number, updateData: UpdateFamilyIncomeDto): Promise<FamilyIncome> {
    // Check if the family income record exists
    const existingFamilyIncome = await this.findOne(id, { relations: ['family', 'familyMember'] });

    // Validate family member if being updated
    if (updateData.familyMemberId) {
      const familyMember = await this.familyMembersService.findOne(updateData.familyMemberId);
      if (!familyMember) {
        throw new BadRequestException(
          this.translateHelper.tr('family-income.errors.family_member_not_found', {
            id: updateData.familyMemberId,
          }),
        );
      }
      // Ensure the family member belongs to the specified family
      if (familyMember.familyId !== existingFamilyIncome.familyId) {
        throw new BadRequestException(
          this.translateHelper.tr('family-income.errors.family_member_mismatch'),
        );
      }
    }

    // Validate amount if being updated
    if (updateData.amount !== undefined && updateData.amount <= 0) {
      throw new BadRequestException(this.translateHelper.tr('family-income.errors.invalid_amount'));
    }

    this.familyIncomeRepository.merge(existingFamilyIncome, updateData);
    return this.familyIncomeRepository.save(existingFamilyIncome);
  }

  async delete(id: number): Promise<void> {
    const result = await this.familyIncomeRepository.delete(id);
    if (!result.affected) {
      throw new BadRequestException(
        this.translateHelper.tr('family-income.errors.delete_not_found', { id }),
      );
    }
  }
}
