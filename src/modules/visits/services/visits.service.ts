import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { MonthlyStatsQueryDto } from '../../../common/dtos/monthly-stats-query.dto';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { paginate } from '../../../common/pagination/paginate.service';
import { FamiliesService } from '../../families/services/families.service';
import { FilterVisitDto } from '../dtos/queries/filter-visit.dto';
import { CreateVisitDto } from '../dtos/requests/create-visit.dto';
import { UpdateVisitDto } from '../dtos/requests/update-visit.dto';
import { VisitResponseDto } from '../dtos/responses/visit-response.dto';
import { Visit } from '../entities/visit.entity';
import { applyVisitFilters } from '../utils/filter.utils';

@Injectable()
export class VisitsService {
  constructor(
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,
    private readonly familiesService: FamiliesService,
  ) {}

  async create(createVisitDto: CreateVisitDto): Promise<Visit> {
    // Verify family exists
    await this.familiesService.findOne(createVisitDto.familyId);
    const visit = this.visitRepository.create(createVisitDto);
    return this.visitRepository.save(visit);
  }

  async findAll(
    filter: FilterVisitDto,
  ): Promise<PaginationResponseDto<VisitResponseDto>> {
    const queryBuilder = this.visitRepository
      .createQueryBuilder('visit')
      .leftJoinAndSelect('visit.family', 'family');

    // Apply filters using utils
    applyVisitFilters(queryBuilder, filter);

    // Order by visit date descending (most recent first)
    queryBuilder.orderBy('visit.visitDate', 'DESC');

    return paginate(queryBuilder, filter, VisitResponseDto);
  }

  async findOne(
    id: number,
    options: FindOneOptions<Visit> = {},
  ): Promise<Visit> {
    const visit = await this.visitRepository.findOne({
      where: { id },
      ...options,
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }
    return visit;
  }

  async update(id: number, updateVisitDto: UpdateVisitDto): Promise<Visit> {
    const visit = await this.findOne(id, { relations: ['family'] });
    const updatedVisit = this.visitRepository.merge(visit, updateVisitDto);
    return this.visitRepository.save(updatedVisit);
  }

  async delete(id: number): Promise<void> {
    const result = await this.visitRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Visit not found');
    }
  }

  async getMonthlyStats(query: MonthlyStatsQueryDto) {
    const { startDate: start, endDate: end } = query;

    const rawData = await this.visitRepository
      .createQueryBuilder('visit')
      .select([
        "DATE_TRUNC('month', visit.created_at) as month",
        'COUNT(*)::int as count',
      ])
      .where('visit.created_at BETWEEN :start AND :end', { start, end })
      .groupBy("DATE_TRUNC('month', visit.created_at)")
      .orderBy("DATE_TRUNC('month', visit.created_at)")
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
}
