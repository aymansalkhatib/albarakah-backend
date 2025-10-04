import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CourseMonthlyStatsQueryDto } from '../../../common/dtos/course-monthly-stats-query.dto';
import { MonthlyStatsResponseDto } from '../../../common/dtos/monthly-stats-response.dto';
import { normalizeDate } from '../../../common/helpers/date.helper';
import { transformToMonthlyStats } from '../../../common/helpers/monthly-stats.helper';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { paginate } from '../../../common/pagination/paginate.service';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';
import { FilterCourseBatchDto } from '../dtos/queries/filter-course-batch.dto';
import { CreateCourseBatchDto } from '../dtos/requests/create-course-batch.dto';
import { UpdateCourseBatchDto } from '../dtos/requests/update-course-batch.dto';
import { CourseBatchResponseDto } from '../dtos/responses/course-batch-response.dto';
import { CourseBatch } from '../entities/course-batch.entity';
import { TrainingCoursesService } from './training-courses.service';

@Injectable()
export class CourseBatchService {
  constructor(
    @InjectRepository(CourseBatch)
    private readonly courseBatchRepository: Repository<CourseBatch>,
    private readonly translateHelper: TranslateHelper,
    private readonly trainingCourseService: TrainingCoursesService,
  ) {}

  async create(
    createCourseBatchDto: CreateCourseBatchDto,
  ): Promise<CourseBatch> {
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
          this.translateHelper.tr(
            'training-courses.course-batches.errors.batch_number_exists',
            {
              batchNumber: createCourseBatchDto.batchNumber,
              courseId: createCourseBatchDto.trainingCourseId,
            },
          ),
        );
      }
    }

    await this.trainingCourseService.findOne(
      createCourseBatchDto.trainingCourseId,
    );

    const courseBatch = this.courseBatchRepository.create(createCourseBatchDto);
    return await this.courseBatchRepository.save(courseBatch);
  }

  async update(
    id: number,
    updateCourseBatchDto: UpdateCourseBatchDto,
  ): Promise<CourseBatch> {
    const courseBatch = await this.findOne(id);
    // Validate chronological order regardless of which field is provided
    const newStartDate =
      updateCourseBatchDto.startDate ?? courseBatch.startDate;
    const newEndDate = updateCourseBatchDto.endDate ?? courseBatch.endDate;

    if (
      newStartDate &&
      newEndDate &&
      normalizeDate(newEndDate) < normalizeDate(newStartDate)
    ) {
      throw new BadRequestException(
        this.translateHelper.tr(
          'training-courses.course-batches.errors.end_date_before_start_date',
        ),
      );
    }

    const mergedCourseBatch = this.courseBatchRepository.merge(
      courseBatch,
      updateCourseBatchDto,
    );
    return await this.courseBatchRepository.save(mergedCourseBatch);
  }

  async delete(id: number): Promise<void> {
    const result = await this.courseBatchRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        this.translateHelper.tr(
          'training-courses.course-batches.errors.not_found',
          { id },
        ),
      );
    }
  }

  async findOne(
    id: number,
    options: FindOneOptions<CourseBatch> = {},
  ): Promise<CourseBatch> {
    const courseBatch = await this.courseBatchRepository.findOne({
      where: { id },
      ...options,
    });

    if (!courseBatch) {
      throw new NotFoundException(
        this.translateHelper.tr(
          'training-courses.course-batches.errors.not_found',
          { id },
        ),
      );
    }

    return courseBatch;
  }

  async findAll(
    filterDto: FilterCourseBatchDto,
  ): Promise<PaginationResponseDto<CourseBatchResponseDto>> {
    const queryBuilder = this.courseBatchRepository
      .createQueryBuilder('courseBatch')
      .leftJoinAndSelect('courseBatch.trainingCourse', 'trainingCourse');

    // Apply filters based on FilterCourseBatchDto
    if (filterDto.trainingCourseId) {
      queryBuilder.andWhere(
        'courseBatch.trainingCourseId = :trainingCourseId',
        {
          trainingCourseId: filterDto.trainingCourseId,
        },
      );
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

    if (filterDto.notes) {
      queryBuilder.andWhere('courseBatch.notes ILIKE :notes', {
        notes: `%${filterDto.notes}%`,
      });
    }

    return paginate(queryBuilder, filterDto, CourseBatchResponseDto);
  }

  async getCourseBatchMonthlyStats(
    query: CourseMonthlyStatsQueryDto,
  ): Promise<MonthlyStatsResponseDto[]> {
    const { startDate: start, endDate: end, trainingCourseId } = query;

    // Build query for course batches
    const queryBuilder = this.courseBatchRepository
      .createQueryBuilder('batch')
      .select([
        "DATE_TRUNC('month', batch.created_at) as month",
        'COUNT(*)::int as count',
      ])
      .where('batch.created_at BETWEEN :start AND :end', { start, end });

    // Add course filter if trainingCourseId is provided
    if (trainingCourseId) {
      queryBuilder.andWhere('batch.trainingCourseId = :trainingCourseId', {
        trainingCourseId,
      });
    }

    const rawData = await queryBuilder
      .groupBy("DATE_TRUNC('month', batch.created_at)")
      .orderBy("DATE_TRUNC('month', batch.created_at)")
      .getRawMany();

    return transformToMonthlyStats(rawData, start, end);
  }

  private async getNextBatchNumber(trainingCourseId: number): Promise<number> {
    const lastBatch = await this.courseBatchRepository.findOne({
      where: { trainingCourseId },
      order: { batchNumber: 'DESC' },
    });

    return lastBatch ? lastBatch.batchNumber + 1 : 1;
  }
}
