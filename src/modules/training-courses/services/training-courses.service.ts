import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainingCourse } from '../entities/training-course.entity';
import { CreateTrainingCourseDto } from '../dtos/requests/create-training-course.dto';
import { UpdateTrainingCourseDto } from '../dtos/requests/update-training-course.dto';
import { FilterTrainingCourseDto } from '../dtos/queries/filter-training-course.dto';
import { paginate } from '@app/common/pagination/paginate.service';
import { PaginationResponseDto } from '@app/common/pagination/dto/pagination-response.dto';
import { TrainingCourseResponseDto } from '../dtos/responses/training-course-response.dto';

@Injectable()
export class TrainingCoursesService {
  constructor(
    @InjectRepository(TrainingCourse)
    private readonly trainingCourseRepository: Repository<TrainingCourse>,
  ) {}

  async create(createTrainingCourseDto: CreateTrainingCourseDto): Promise<TrainingCourse> {
    const trainingCourse = this.trainingCourseRepository.create(createTrainingCourseDto);
    return await this.trainingCourseRepository.save(trainingCourse);
  }

  async update(
    id: number,
    updateTrainingCourseDto: UpdateTrainingCourseDto,
  ): Promise<TrainingCourse> {
    const trainingCourse = await this.findOne(id);

    const mergedTrainingCourse = this.trainingCourseRepository.merge(
      trainingCourse,
      updateTrainingCourseDto,
    );

    return await this.trainingCourseRepository.save(mergedTrainingCourse);
  }

  async delete(id: number): Promise<void> {
    // Find the training course with its batches to ensure cascade delete works
    const trainingCourse = await this.trainingCourseRepository.findOne({
      where: { id },
      relations: ['batches', 'batches.participants'],
    });

    if (!trainingCourse) {
      throw new NotFoundException(`Training course with ID ${id} not found`);
    }

    // Delete with cascade - this will automatically delete related batches and participants
    await this.trainingCourseRepository.remove(trainingCourse);
  }

  async findOne(id: number, relations: string[] = []): Promise<TrainingCourse> {
    const trainingCourse = await this.trainingCourseRepository.findOne({
      where: { id },
      relations,
    });

    if (!trainingCourse) {
      throw new NotFoundException(`Training course with ID ${id} not found`);
    }

    return trainingCourse;
  }

  async findAll(
    filterDto: FilterTrainingCourseDto,
  ): Promise<PaginationResponseDto<TrainingCourseResponseDto>> {
    const queryBuilder = this.trainingCourseRepository.createQueryBuilder('trainingCourse');

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

    if (filterDto.note) {
      queryBuilder.andWhere('trainingCourse.note ILIKE :note', {
        note: `%${filterDto.note}%`,
      });
    }

    return paginate(queryBuilder, filterDto, TrainingCourseResponseDto);
  }
}
