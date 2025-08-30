import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { paginate } from '../../../common/pagination/paginate.service';
import { FamiliesService } from '../../families/services/families.service';
import { FilterVisitDto } from '../dtos/queries/filter-visit.dto';
import { CreateVisitDto } from '../dtos/requests/create-visit.dto';
import { UpdateVisitDto } from '../dtos/requests/update-visit.dto';
import { VisitResponseDto } from '../dtos/responses/visit-response.dto';
import { Visit } from '../entities/visit.entity';

@Injectable()
export class VisitsService {
  constructor(
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,
    private readonly familiesService: FamiliesService,
  ) {}

  async create(createVisitDto: CreateVisitDto): Promise<Visit> {
    await this.familiesService.findOne(createVisitDto.familyId);
    const visit = this.visitRepository.create({
      ...createVisitDto,
    });
    return this.visitRepository.save(visit);
  }

  async findAll(filter: FilterVisitDto): Promise<PaginationResponseDto<VisitResponseDto>> {
    const queryBuilder = this.visitRepository.createQueryBuilder('visit');

    if (filter.familyId) {
      queryBuilder.andWhere('visit.familyId = :familyId', { familyId: filter.familyId });
    }

    if (filter.visitDateFrom) {
      queryBuilder.andWhere('visit.visitDate >= :visitDateFrom', {
        visitDateFrom: filter.visitDateFrom,
      });
    }

    if (filter.visitDateTo) {
      queryBuilder.andWhere('visit.visitDate <= :visitDateTo', { visitDateTo: filter.visitDateTo });
    }

    if (filter.visitDispatchDateFrom) {
      queryBuilder.andWhere('visit.visitDispatchDate >= :visitDispatchDateFrom', {
        visitDispatchDateFrom: filter.visitDispatchDateFrom,
      });
    }

    if (filter.visitDispatchDateTo) {
      queryBuilder.andWhere('visit.visitDispatchDate <= :visitDispatchDateTo', {
        visitDispatchDateTo: filter.visitDispatchDateTo,
      });
    }

    if (filter.visitNotes) {
      queryBuilder.andWhere('visit.visitNotes ILIKE :visitNotes', {
        visitNotes: `%${filter.visitNotes}%`,
      });
    }

    if (filter.minFamilyMembersCount !== undefined) {
      queryBuilder.andWhere('visit.familyMembersCount >= :minFamilyMembersCount', {
        minFamilyMembersCount: filter.minFamilyMembersCount,
      });
    }

    if (filter.maxFamilyMembersCount !== undefined) {
      queryBuilder.andWhere('visit.familyMembersCount <= :maxFamilyMembersCount', {
        maxFamilyMembersCount: filter.maxFamilyMembersCount,
      });
    }

    if (filter.minHouseResidentsCount !== undefined) {
      queryBuilder.andWhere('visit.houseResidentsCount >= :minHouseResidentsCount', {
        minHouseResidentsCount: filter.minHouseResidentsCount,
      });
    }

    if (filter.maxHouseResidentsCount !== undefined) {
      queryBuilder.andWhere('visit.houseResidentsCount <= :maxHouseResidentsCount', {
        maxHouseResidentsCount: filter.maxHouseResidentsCount,
      });
    }

    if (filter.familyHealthConditions) {
      queryBuilder.andWhere('visit.familyHealthConditions ILIKE :familyHealthConditions', {
        familyHealthConditions: `%${filter.familyHealthConditions}%`,
      });
    }

    if (filter.visitCommitteeEvaluation) {
      queryBuilder.andWhere('visit.visitCommitteeEvaluation ILIKE :visitCommitteeEvaluation', {
        visitCommitteeEvaluation: `%${filter.visitCommitteeEvaluation}%`,
      });
    }

    if (filter.finalEvaluation) {
      queryBuilder.andWhere('visit.finalEvaluation ILIKE :finalEvaluation', {
        finalEvaluation: `%${filter.finalEvaluation}%`,
      });
    }

    return paginate(queryBuilder, filter, VisitResponseDto);
  }

  async findOne(id: number, options: FindOneOptions<Visit> = {}): Promise<Visit> {
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
    const visit = await this.visitRepository.findOne({
      where: { id },
      relations: ['house', 'family'],
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    const updatedVisit = this.visitRepository.merge(visit, updateVisitDto);
    return this.visitRepository.save(updatedVisit);
  }

  async delete(id: number): Promise<void> {
    await this.visitRepository.findOne({
      where: { id },
      relations: ['house', 'family'],
    });

    await this.visitRepository.delete(id);
  }
}
