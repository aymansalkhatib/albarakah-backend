import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { paginate } from '../../../common/pagination/paginate.service';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';

import { Interview } from '../entities/interview.entity';
import { CreateInterviewDto } from '../dtos/requests/create-interview.dto';
import { UpdateInterviewDto } from '../dtos/requests/update-interview.dto';
import { FilterInterviewDto } from '../dtos/queries/filter-interview.dto';
import { InterviewResponseDto } from '../dtos/responses/interview-response.dto';
import { FamiliesService } from '../../families/services/families.service';
import { EmployeesService } from '../../employees/services/employee.service';
import { Employee } from '../../employees/entities/employee.entity';
import { Family } from '../../families/entities/families.entity';
import { applyInterviewFilters } from '../utils';
import { applyFamilyFilters } from '../../families/utils';
import { applyEmployeeFilters } from '../../employees/utils';
import { applyPersonFilters } from '../../persons/utils/person-filter.util';

@Injectable()
export class InterviewsService {
  constructor(
    @InjectRepository(Interview)
    private readonly interviewRepository: Repository<Interview>,
    private readonly familiesService: FamiliesService,
    private readonly employeesService: EmployeesService,
    private readonly translateHelper: TranslateHelper,
  ) {}

  async create(dto: CreateInterviewDto): Promise<Interview> {
    const family = await this.familiesService.findOne(dto.familyId);
    let interviewer: Employee | undefined;
    if (dto.interviewerId) {
      interviewer = await this.employeesService.findOne(dto.interviewerId, {
        relations: ['person'],
      });
    }

    const interview = this.interviewRepository.create({
      ...dto,
      family,
      interviewer,
    });

    return await this.interviewRepository.save(interview);
  }

  async findAll(filter: FilterInterviewDto): Promise<PaginationResponseDto<InterviewResponseDto>> {
    const qb = this.interviewRepository
      .createQueryBuilder('interview')
      .leftJoinAndSelect('interview.family', 'family')
      .leftJoinAndSelect('interview.interviewer', 'interviewer')
      .leftJoinAndSelect('interviewer.person', 'interviewerPerson');

    // Apply interview filters
    applyInterviewFilters(qb, 'interview', filter);

    // Apply family filters
    if (filter.family) {
      applyFamilyFilters(qb, 'family', filter.family);
    }

    // Apply interviewer (employee) filters
    if (filter.interviewer) {
      applyEmployeeFilters(qb, 'interviewer', filter.interviewer);
    }

    // Apply interviewer person filters
    if (filter.interviewer?.person) {
      applyPersonFilters(qb, 'interviewerPerson', filter.interviewer.person);
    }

    return paginate(qb, filter, InterviewResponseDto);
  }

  async findOne(id: number, options: FindOneOptions<Interview> = {}): Promise<Interview> {
    const interview = await this.interviewRepository.findOne({
      where: { id },
      ...options,
    });
    if (!interview) {
      throw new NotFoundException(this.translateHelper.tr('interviews.errors.not_found'));
    }
    return interview;
  }

  async update(id: number, dto: UpdateInterviewDto): Promise<Interview> {
    const interview = await this.findOne(id);
    let interviewer: Employee | undefined;
    let family: Family | undefined;

    if (dto.familyId) {
      family = await this.familiesService.findOne(dto.familyId);
    }
    if (dto.interviewerId) {
      interviewer = await this.employeesService.findOne(dto.interviewerId);
    }

    this.interviewRepository.merge(interview, dto);
    return await this.interviewRepository.save(interview);
  }

  async delete(id: number): Promise<void> {
    const result = await this.interviewRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(this.translateHelper.tr('interviews.errors.not_found'));
    }
  }
}
