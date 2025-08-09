import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseBatch } from '../entities/course-batch.entity';
import { CreateCourseBatchDto } from '../dtos/requests/create-course-batch.dto';
import { UpdateCourseBatchDto } from '../dtos/requests/update-course-batch.dto';
import { FilterCourseBatchDto } from '../dtos/queries/filter-course-batch.dto';
import { paginate } from '@app/common/pagination/paginate.service';
import { PaginationResponseDto } from '@app/common/pagination/dto/pagination-response.dto';
import { CourseBatchResponseDto } from '../dtos/responses/course-batch-response.dto';
import { TranslateHelper } from '@app/shared/modules/app-i18n/translate.helper';
import { normalizeDate } from '@app/common/helpers/date.helper';
import { TrainingCoursesService } from './training-courses.service';

@Injectable()
export class CourseBatchService {
  constructor(
    @InjectRepository(CourseBatch)
    private readonly courseBatchRepository: Repository<CourseBatch>,
    private readonly translateHelper: TranslateHelper,
    private readonly trainingCourseService: TrainingCoursesService,
  ) {}

  async create(createCourseBatchDto: CreateCourseBatchDto): Promise<CourseBatch> {
    // If batchNumber is not provided, auto-generate it
    if (!createCourseBatchDto.batchNumber) {
      createCourseBatchDto.batchNumber = await this.getNextBatchNumber(
        createCourseBatchDto.trainingCourseId,
      );
    } else {
      // If batchNumber is provided, check if it already exists for this course
      const existingBatch = await this.courseBatchRepository.findOne({
        where: {
          trainingCourseId: createCourseBatchDto.trainingCourseId,
          batchNumber: createCourseBatchDto.batchNumber,
        },
      });

      if (existingBatch) {
        throw new BadRequestException(
          this.translateHelper.tr('training-courses.course-batches.errors.batch_number_exists', {
            batchNumber: createCourseBatchDto.batchNumber,
            courseId: createCourseBatchDto.trainingCourseId,
          }),
        );
      }
    }

    await this.trainingCourseService.findOne(createCourseBatchDto.trainingCourseId);

    const courseBatch = this.courseBatchRepository.create(createCourseBatchDto);
    return await this.courseBatchRepository.save(courseBatch);
  }

  async update(id: number, updateCourseBatchDto: UpdateCourseBatchDto): Promise<CourseBatch> {
    const courseBatch = await this.findOne(id);
    // Validate chronological order regardless of which field is provided
    const newStartDate = updateCourseBatchDto.startDate ?? courseBatch.startDate;
    const newEndDate = updateCourseBatchDto.endDate ?? courseBatch.endDate;

    if (newStartDate && newEndDate && normalizeDate(newEndDate) < normalizeDate(newStartDate)) {
      throw new BadRequestException(
        this.translateHelper.tr(
          'training-courses.course-batches.errors.end_date_before_start_date',
        ),
      );
    }

    const mergedCourseBatch = this.courseBatchRepository.merge(courseBatch, updateCourseBatchDto);
    return await this.courseBatchRepository.save(mergedCourseBatch);
  }

  async delete(id: number): Promise<void> {
    const result = await this.courseBatchRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        this.translateHelper.tr('training-courses.course-batches.errors.not_found', { id }),
      );
    }
  }

  async findOne(id: number, relations: string[] = []): Promise<CourseBatch> {
    const courseBatch = await this.courseBatchRepository.findOne({
      where: { id },
      relations,
    });

    if (!courseBatch) {
      throw new NotFoundException(
        this.translateHelper.tr('training-courses.course-batches.errors.not_found', { id }),
      );
    }

    return courseBatch;
  }

  async findAll(
    filterDto: FilterCourseBatchDto,
  ): Promise<PaginationResponseDto<CourseBatchResponseDto>> {
    const queryBuilder = this.courseBatchRepository.createQueryBuilder('courseBatch');

    // Apply filters based on FilterCourseBatchDto
    if (filterDto.trainingCourseId) {
      queryBuilder.andWhere('courseBatch.trainingCourseId = :trainingCourseId', {
        trainingCourseId: filterDto.trainingCourseId,
      });
    }

    if (filterDto.batchNumber) {
      queryBuilder.andWhere('courseBatch.batchNumber = :batchNumber', {
        batchNumber: filterDto.batchNumber,
      });
    }

    if (filterDto.startDate) {
      queryBuilder.andWhere('courseBatch.startDate >= :startDate', {
        startDate: filterDto.startDate,
      });
    }

    if (filterDto.endDate) {
      queryBuilder.andWhere('courseBatch.endDate <= :endDate', {
        endDate: filterDto.endDate,
      });
    }

    if (filterDto.location) {
      queryBuilder.andWhere('courseBatch.location ILIKE :location', {
        location: `%${filterDto.location}%`,
      });
    }

    if (filterDto.note) {
      queryBuilder.andWhere('courseBatch.note ILIKE :note', {
        note: `%${filterDto.note}%`,
      });
    }

    return paginate(queryBuilder, filterDto, CourseBatchResponseDto);
  }

  private async getNextBatchNumber(trainingCourseId: number): Promise<number> {
    const lastBatch = await this.courseBatchRepository.findOne({
      where: { trainingCourseId },
      order: { batchNumber: 'DESC' },
    });

    return lastBatch ? lastBatch.batchNumber + 1 : 1;
  }
}
