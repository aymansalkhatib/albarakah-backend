import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Not, Repository } from 'typeorm';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { paginate } from '../../../common/pagination/paginate.service';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';
import { FilterTrainingCourseDto } from '../dtos/queries/filter-training-course.dto';
import { CreateTrainingCourseDto } from '../dtos/requests/create-training-course.dto';
import { UpdateTrainingCourseDto } from '../dtos/requests/update-training-course.dto';
import { TrainingCourseResponseDto } from '../dtos/responses/training-course-response.dto';
import { TrainingCourse } from '../entities/training-course.entity';

@Injectable()
export class TrainingCoursesService {
  constructor(
    @InjectRepository(TrainingCourse)
    private readonly trainingCourseRepository: Repository<TrainingCourse>,
    private readonly translateHelper: TranslateHelper,
  ) {}

  async create(
    createTrainingCourseDto: CreateTrainingCourseDto,
  ): Promise<TrainingCourse> {
    await this.isNameExists(createTrainingCourseDto.name);

    const trainingCourse = this.trainingCourseRepository.create(
      createTrainingCourseDto,
    );
    return await this.trainingCourseRepository.save(trainingCourse);
  }

  async update(
    id: number,
    updateTrainingCourseDto: UpdateTrainingCourseDto,
  ): Promise<TrainingCourse> {
    const trainingCourse = await this.findOne(id);

    await this.isNameExists(updateTrainingCourseDto.name, id);

    const mergedTrainingCourse = this.trainingCourseRepository.merge(
      trainingCourse,
      updateTrainingCourseDto,
    );

    return await this.trainingCourseRepository.save(mergedTrainingCourse);
  }

  async delete(id: number): Promise<void> {
    const result = await this.trainingCourseRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(
        this.translateHelper.tr(
          'training-courses.training-courses.errors.not_found',
          { id },
        ),
      );
    }
  }

  async findOne(
    id: number,
    options: FindOneOptions<TrainingCourse> = {},
  ): Promise<TrainingCourse> {
    const trainingCourse = await this.trainingCourseRepository.findOne({
      where: { id },
      ...options,
    });

    if (!trainingCourse) {
      throw new NotFoundException(
        this.translateHelper.tr(
          'training-courses.training-courses.errors.not_found',
          { id },
        ),
      );
    }

    return trainingCourse;
  }

  async findAll(
    filterDto: FilterTrainingCourseDto,
  ): Promise<PaginationResponseDto<TrainingCourseResponseDto>> {
    const queryBuilder =
      this.trainingCourseRepository.createQueryBuilder('trainingCourse');

    // Apply filters based on FilterTrainingCourseDto
    if (filterDto.name) {
      queryBuilder.andWhere('trainingCourse.name ILIKE :name', {
        name: `%${filterDto.name}%`,
      });
    }

    if (filterDto.description) {
      queryBuilder.andWhere('trainingCourse.description ILIKE :description', {
        description: `%${filterDto.description}%`,
      });
    }

    if (filterDto.notes) {
      queryBuilder.andWhere('trainingCourse.notes ILIKE :notes', {
        notes: `%${filterDto.notes}%`,
      });
    }

    return paginate(queryBuilder, filterDto, TrainingCourseResponseDto);
  }

  async isNameExists(name: string, excludeId?: number) {
    const where: any = { name };
    if (excludeId !== undefined) {
      where.id = Not(excludeId);
    }
    const existingCourse = await this.trainingCourseRepository.findOne({
      where,
    });

    if (existingCourse) {
      throw new BadRequestException(
        this.translateHelper.tr(
          'training-courses.training-courses.errors.name_exists',
        ),
      );
    }
  }
}
