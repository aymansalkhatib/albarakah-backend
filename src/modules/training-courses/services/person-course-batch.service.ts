import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonCourseBatch } from '../entities/person-course-batch.entity';
import { CreatePersonCourseBatchDto } from '../dtos/requests/create-person-course-batch.dto';
import { UpdatePersonCourseBatchDto } from '../dtos/requests/update-person-course-batch.dto';
import { FilterPersonCourseBatchDto } from '../dtos/queries/filter-person-course-batch.dto';
import { paginate } from '@app/common/pagination/paginate.service';
import { PaginationResponseDto } from '@app/common/pagination/dto/pagination-response.dto';
import { PersonCourseBatchResponseDto } from '../dtos/responses/person-course-batch-response.dto';
import { TranslateHelper } from '@app/shared/modules/app-i18n/translate.helper';

@Injectable()
export class PersonCourseBatchService {
  constructor(
    @InjectRepository(PersonCourseBatch)
    private readonly personCourseBatchRepository: Repository<PersonCourseBatch>,
    private readonly translateHelper: TranslateHelper,
  ) {}

  async create(createPersonCourseBatchDto: CreatePersonCourseBatchDto): Promise<PersonCourseBatch> {
    // Check if person is already enrolled in this course batch
    const existingEnrollment = await this.personCourseBatchRepository.findOne({
      where: {
        familyMemberId: createPersonCourseBatchDto.familyMemberId,
        courseBatchId: createPersonCourseBatchDto.courseBatchId,
      },
    });

    if (existingEnrollment) {
      throw new ConflictException(
        this.translateHelper.tr('training-courses.person-course-batches.errors.already_enrolled', {
          familyMemberId: createPersonCourseBatchDto.familyMemberId,
          courseBatchId: createPersonCourseBatchDto.courseBatchId,
        }),
      );
    }

    const personCourseBatch = this.personCourseBatchRepository.create(createPersonCourseBatchDto);
    return await this.personCourseBatchRepository.save(personCourseBatch);
  }

  async update(
    id: number,
    updatePersonCourseBatchDto: UpdatePersonCourseBatchDto,
  ): Promise<PersonCourseBatch> {
    const personCourseBatch = await this.findOne(id);

    const mergedPersonCourseBatch = this.personCourseBatchRepository.merge(
      personCourseBatch,
      updatePersonCourseBatchDto,
    );

    return await this.personCourseBatchRepository.save(mergedPersonCourseBatch);
  }

  async delete(id: number): Promise<void> {
    const result = await this.personCourseBatchRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        this.translateHelper.tr('training-courses.person-course-batches.errors.not_found', { id }),
      );
    }
  }

  async findOne(id: number, relations: string[] = []): Promise<PersonCourseBatch> {
    const personCourseBatch = await this.personCourseBatchRepository.findOne({
      where: { id },
      relations,
    });

    if (!personCourseBatch) {
      throw new NotFoundException(
        this.translateHelper.tr('training-courses.person-course-batches.errors.not_found', { id }),
      );
    }

    return personCourseBatch;
  }

  async findAll(
    filterDto: FilterPersonCourseBatchDto,
  ): Promise<PaginationResponseDto<PersonCourseBatchResponseDto>> {
    const queryBuilder = this.personCourseBatchRepository
      .createQueryBuilder('personCourseBatch')
      .leftJoinAndSelect('personCourseBatch.familyMember', 'familyMember')
      .leftJoinAndSelect('familyMember.person', 'person');

    // Add courseBatch join if trainingCourseId filter is provided
    if (filterDto.trainingCourseId) {
      queryBuilder.leftJoinAndSelect('personCourseBatch.courseBatch', 'courseBatch');
    }

    // Apply filters
    if (filterDto.familyMemberId) {
      queryBuilder.andWhere('personCourseBatch.familyMemberId = :familyMemberId', {
        familyMemberId: filterDto.familyMemberId,
      });
    }

    if (filterDto.courseBatchId) {
      queryBuilder.andWhere('personCourseBatch.courseBatchId = :courseBatchId', {
        courseBatchId: filterDto.courseBatchId,
      });
    }

    if (filterDto.trainingCourseId) {
      queryBuilder.andWhere('courseBatch.trainingCourseId = :trainingCourseId', {
        trainingCourseId: filterDto.trainingCourseId,
      });
    }

    if (filterDto.attendanceStatus) {
      queryBuilder.andWhere('personCourseBatch.attendanceStatus = :attendanceStatus', {
        attendanceStatus: filterDto.attendanceStatus,
      });
    }

    // Date range filters
    if (filterDto.joinDateFrom) {
      queryBuilder.andWhere('personCourseBatch.joinDate >= :joinDateFrom', {
        joinDateFrom: filterDto.joinDateFrom,
      });
    }
    if (filterDto.joinDateTo) {
      queryBuilder.andWhere('personCourseBatch.joinDate <= :joinDateTo', {
        joinDateTo: filterDto.joinDateTo,
      });
    }

    if (filterDto.dropOutDateFrom) {
      queryBuilder.andWhere('personCourseBatch.dropOutDate >= :dropOutDateFrom', {
        dropOutDateFrom: filterDto.dropOutDateFrom,
      });
    }
    if (filterDto.dropOutDateTo) {
      queryBuilder.andWhere('personCourseBatch.dropOutDate <= :dropOutDateTo', {
        dropOutDateTo: filterDto.dropOutDateTo,
      });
    }

    if (filterDto.evaluation) {
      queryBuilder.andWhere('personCourseBatch.evaluation ILIKE :evaluation', {
        evaluation: `%${filterDto.evaluation}%`,
      });
    }

    if (filterDto.notes) {
      queryBuilder.andWhere('personCourseBatch.notes ILIKE :notes', {
        notes: `%${filterDto.notes}%`,
      });
    }

    return paginate(queryBuilder, filterDto, PersonCourseBatchResponseDto);
  }
}
