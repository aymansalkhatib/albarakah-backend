import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EntityManager, FindOneOptions, Repository } from 'typeorm';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { paginate } from '../../../common/pagination/paginate.service';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';
import { EmployeesService } from '../../employees/services/employee.service';
import { FilterFamilyDto } from '../dtos/queries/filter-family.dto';
import { MonthlyFamilyStatsQueryDto } from '../dtos/queries/monthly-family-stats-query.dto';
import { CreateFamilyDto } from '../dtos/requests/create-family-dto';
import { UpdateFamilyDto } from '../dtos/requests/update-family-dto';
import { FamilyResponseDto } from '../dtos/responses/family-response.dto';
import { Family } from '../entities/families.entity';
import { applyFamilyFilters } from '../utils/family-filter.util';

@Injectable()
export class FamiliesService {
  constructor(
    @InjectRepository(Family)
    private readonly familyRepository: Repository<Family>,
    private readonly translateHelper: TranslateHelper,
    private readonly employeesService: EmployeesService,
  ) {}

  async create(
    createFamilyDto: CreateFamilyDto,
    entityManager?: EntityManager,
  ): Promise<Family> {
    const familyRepository =
      entityManager?.getRepository(Family) ?? this.familyRepository;

    if (createFamilyDto.contactedByEmployeeId) {
      await this.employeesService.findOne(
        createFamilyDto.contactedByEmployeeId,
      );
    }

    if (createFamilyDto.familyBookNumber) {
      const existingFamily = await this.findOneByFamilyBookNumber(
        createFamilyDto.familyBookNumber,
      );
      if (existingFamily) {
        throw new ConflictException(
          this.translateHelper.tr('families.family_book_number_exists'),
        );
      }
    }

    if (createFamilyDto.requestNumber) {
      const existingFamily = await this.findOneByRequestNumber(
        createFamilyDto.requestNumber,
      );
      if (existingFamily) {
        throw new ConflictException(
          this.translateHelper.tr('families.request_number_exists'),
        );
      }
    }

    if (createFamilyDto.formNumber) {
      const existingFamily = await this.findOneByFormNumber(
        createFamilyDto.formNumber,
      );
      if (existingFamily) {
        throw new ConflictException(
          this.translateHelper.tr('families.form_number_exists'),
        );
      }
    }

    const family = familyRepository.create(createFamilyDto);
    return familyRepository.save(family);
  }

  async findAll(
    filter: FilterFamilyDto,
  ): Promise<PaginationResponseDto<FamilyResponseDto>> {
    const queryBuilder = this.familyRepository.createQueryBuilder('family');
    applyFamilyFilters(queryBuilder, 'family', filter);
    return paginate(queryBuilder, filter, FamilyResponseDto);
  }

  async findOne(
    id: number,
    options: FindOneOptions<Family> = {},
    entityManager?: EntityManager,
  ): Promise<Family> {
    const familyRepository =
      entityManager?.getRepository(Family) ?? this.familyRepository;

    const family = await familyRepository.findOne({
      where: { id },
      ...options,
    });
    if (!family) {
      throw new NotFoundException(
        this.translateHelper.tr('families.not_found'),
      );
    }
    return family;
  }

  async getMonthlyStats(query: MonthlyFamilyStatsQueryDto) {
    const { startDate: start, endDate: end } = query;

    const rawData = await this.familyRepository
      .createQueryBuilder('family')
      .select([
        "DATE_TRUNC('month', family.created_at) as month",
        'COUNT(*)::int as count',
      ])
      .where('family.created_at BETWEEN :start AND :end', { start, end })
      .groupBy("DATE_TRUNC('month', family.created_at)")
      .orderBy("DATE_TRUNC('month', family.created_at)")
      .getRawMany();

    const dataMap = new Map(
      rawData.map((row) => [
        new Date(row.month).toISOString().substring(0, 7),
        row.count,
      ]),
    );

    const result = [];
    let current = new Date(start.getFullYear(), start.getMonth(), 1);
    const last = new Date(end.getFullYear(), end.getMonth(), 1);

    while (current <= last) {
      const monthKey = current.toISOString().substring(0, 7);

      const from =
        current.getTime() ===
        new Date(start.getFullYear(), start.getMonth(), 1).getTime()
          ? start
          : new Date(current);

      const to =
        current.getTime() === last.getTime()
          ? end
          : new Date(
              Date.UTC(
                current.getFullYear(),
                current.getMonth() + 1,
                0,
                23,
                59,
                59,
                999,
              ),
            );

      result.push({
        from,
        to,
        count: dataMap.get(monthKey) || 0,
      });

      current.setMonth(current.getMonth() + 1);
    }

    return result;
  }

  async update(
    id: number,
    updateFamilyDto: UpdateFamilyDto,
    entityManager?: EntityManager,
  ): Promise<Family> {
    const familyRepository =
      entityManager?.getRepository(Family) ?? this.familyRepository;

    const family = await familyRepository.findOneBy({ id });

    if (!family) {
      throw new NotFoundException(
        this.translateHelper.tr('families.not_found'),
      );
    }

    if (updateFamilyDto.contactedByEmployeeId) {
      await this.employeesService.findOne(
        updateFamilyDto.contactedByEmployeeId,
        {},
        entityManager,
      );
    }

    if (updateFamilyDto.familyBookNumber) {
      const existingFamily = await this.findOneByFamilyBookNumber(
        updateFamilyDto.familyBookNumber,
        entityManager,
      );

      if (existingFamily && existingFamily.id !== id) {
        throw new ConflictException(
          this.translateHelper.tr('families.family_book_number_exists_another'),
        );
      }
    }

    if (updateFamilyDto.requestNumber) {
      const existingFamily = await this.findOneByRequestNumber(
        updateFamilyDto.requestNumber,
        entityManager,
      );
      if (existingFamily && existingFamily.id !== id) {
        throw new ConflictException(
          this.translateHelper.tr('families.request_number_exists_another'),
        );
      }
    }

    if (updateFamilyDto.formNumber) {
      const existingFamily = await this.findOneByFormNumber(
        updateFamilyDto.formNumber,
        entityManager,
      );
      if (existingFamily && existingFamily.id !== id) {
        throw new ConflictException(
          this.translateHelper.tr('families.form_number_exists_another'),
        );
      }
    }

    const updatedFamily = familyRepository.merge(family, updateFamilyDto);
    return familyRepository.save(updatedFamily);
  }

  async delete(id: number): Promise<void> {
    // First, find the family to ensure it exists and load all relations
    const family = await this.findOne(id, {
      relations: [
        'familyMembers',
        'familyMembers.person',
        'needs',
        'receivedAssistance',
        'emergencyAidRequests',
        'visits',
      ],
    });

    // Use a transaction to ensure all deletions are atomic
    await this.familyRepository.manager.transaction(async (entityManager) => {
      // Delete family members and their associated persons
      if (family.familyMembers && family.familyMembers.length > 0) {
        for (const member of family.familyMembers) {
          // Delete the family member
          await entityManager.delete('family_members', member.id);
          // Delete the associated person if it's only used by this family member
          if (member.person) {
            await entityManager.delete('person', member.person.id);
          }
        }
      }

      // Delete family needs
      if (family.needs && family.needs.length > 0) {
        await entityManager.delete('family_needs', { familyId: id });
      }

      // Delete received assistance records
      if (family.receivedAssistance && family.receivedAssistance.length > 0) {
        await entityManager.delete('received_assistance', { familyId: id });
      }

      // Delete emergency aid requests
      if (
        family.emergencyAidRequests &&
        family.emergencyAidRequests.length > 0
      ) {
        await entityManager.delete('emergency_aid_requests', { familyId: id });
      }

      // Delete visits
      if (family.visits && family.visits.length > 0) {
        await entityManager.delete('visits', { familyId: id });
      }

      // Finally, delete the family itself
      const result = await entityManager.delete('families', id);
      if (!result.affected) {
        throw new NotFoundException(
          this.translateHelper.tr('families.not_found'),
        );
      }
    });
  }

  // private methods
  private findOneByFamilyBookNumber(
    familyBookNumber: string,
    entityManager?: EntityManager,
  ): Promise<Family | undefined> {
    const familyRepository =
      entityManager?.getRepository(Family) ?? this.familyRepository;

    return familyRepository.findOneBy({ familyBookNumber });
  }

  private findOneByRequestNumber(
    requestNumber: string,
    entityManager?: EntityManager,
  ): Promise<Family | undefined> {
    const familyRepository =
      entityManager?.getRepository(Family) ?? this.familyRepository;

    return familyRepository.findOneBy({ requestNumber });
  }

  private findOneByFormNumber(
    formNumber: string,
    entityManager?: EntityManager,
  ): Promise<Family | undefined> {
    const familyRepository =
      entityManager?.getRepository(Family) ?? this.familyRepository;

    return familyRepository.findOneBy({ formNumber });
  }
}
