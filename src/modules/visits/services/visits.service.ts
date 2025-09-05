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
    // await this.familiesService.findOne(createVisitDto.familyId);
    const visit = this.visitRepository.create({
      ...createVisitDto,
    });
    return this.visitRepository.save(visit);
  }

  async findAll(
    filter: FilterVisitDto,
  ): Promise<PaginationResponseDto<VisitResponseDto>> {
    const queryBuilder = this.visitRepository.createQueryBuilder('visit');

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
    const visit = await this.visitRepository.findOne({
      where: { id },
      relations: ['family'],
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
      relations: ['family'],
    });

    await this.visitRepository.delete(id);
  }
}
