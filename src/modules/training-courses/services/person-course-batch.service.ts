import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { normalizeDate } from '../../../common/helpers/date.helper';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { paginate } from '../../../common/pagination/paginate.service';
import { FamilyMembersService } from '../../../modules/family-members/services/family-members.service';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';
import { FilterPersonCourseBatchDto } from '../dtos/queries/filter-person-course-batch.dto';
import { CreatePersonCourseBatchDto } from '../dtos/requests/create-person-course-batch.dto';
import { UpdatePersonCourseBatchDto } from '../dtos/requests/update-person-course-batch.dto';
import { PersonCourseBatchResponseDto } from '../dtos/responses/person-course-batch-response.dto';
import { PersonCourseBatch } from '../entities/person-course-batch.entity';
import { CourseBatchService } from './course-batch.service';

@Injectable()
export class PersonCourseBatchService {
  constructor(
    @InjectRepository(PersonCourseBatch)
    private readonly personCourseBatchRepository: Repository<PersonCourseBatch>,
    private readonly translateHelper: TranslateHelper,
    private readonly courseBatchService: CourseBatchService,
    private readonly familyMemberService: FamilyMembersService,
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

    await this.courseBatchService.findOne(createPersonCourseBatchDto.courseBatchId);
    await this.familyMemberService.findOne(createPersonCourseBatchDto.familyMemberId);

    const personCourseBatch = this.personCourseBatchRepository.create(createPersonCourseBatchDto);
    return await this.personCourseBatchRepository.save(personCourseBatch);
  }

  async update(
    id: number,
    updatePersonCourseBatchDto: UpdatePersonCourseBatchDto,
  ): Promise<PersonCourseBatch> {
    const personCourseBatch = await this.findOne(id);

    // Validate chronological order regardless of which field is provided
    const newJoinDate = updatePersonCourseBatchDto.joinDate ?? personCourseBatch.joinDate;
    const newDropOutDate = updatePersonCourseBatchDto.dropOutDate ?? personCourseBatch.dropOutDate;
    if (newJoinDate && newDropOutDate) {
      if (normalizeDate(newDropOutDate) < normalizeDate(newJoinDate)) {
        throw new BadRequestException(
          this.translateHelper.tr(
            'training-courses.person-course-batches.errors.drop_out_date_before_join_date',
          ),
        );
      }
    }

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

  async findOne(
    id: number,
    options: FindOneOptions<PersonCourseBatch> = {},
  ): Promise<PersonCourseBatch> {
    const personCourseBatch = await this.personCourseBatchRepository.findOne({
      where: { id },
      ...options,
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
      .leftJoinAndSelect('personCourseBatch.courseBatch', 'courseBatch')
      .leftJoinAndSelect('personCourseBatch.familyMember', 'familyMember')
      .leftJoinAndSelect('familyMember.person', 'person');

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
