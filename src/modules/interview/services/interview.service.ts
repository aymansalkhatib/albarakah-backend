import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { Family } from '../../families/entities/families.entity';
import { FamiliesService } from '../../families/services/families.service';
import { FamilyMember } from '../../family-members/entities/family-members.entity';
import { FamilyMembersService } from '../../family-members/services/family-members.service';
import { CreateInterviewDto } from '../dtos/requests/create-interview.dto';
import { GetInterviewsQueryDto } from '../dtos/requests/get-interviews-query.dto';
import { UpdateInterviewDto } from '../dtos/requests/update-interview.dto';
import { InterviewResponseDto } from '../dtos/responses/interview-response.dto';

@Injectable()
export class InterviewService {
  constructor(
    private readonly familiesService: FamiliesService,
    private readonly familyMembersService: FamilyMembersService,
    @InjectRepository(FamilyMember)
    private readonly familyMemberRepository: Repository<FamilyMember>,
    @InjectRepository(Family)
    private readonly familyRepository: Repository<Family>,
  ) {}

  async create(
    createInterviewDto: CreateInterviewDto,
  ): Promise<InterviewResponseDto> {
    return this.familyMemberRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        // Create the family first
        const family = await this.familiesService.create(
          createInterviewDto.family,
          entityManager,
        );

        // Set the family ID for the guardian
        const guardianData = {
          ...createInterviewDto.guardian,
          familyId: family.id,
          isGuardian: true, // Ensure guardian is marked as guardian
        };

        // Create the guardian
        const guardian = await this.familyMembersService.create(
          guardianData,
          entityManager,
        );

        // Transform to response DTO
        return {
          family,
          guardian,
          familyMembers: [],
        };
      },
    );
  }

  async findAll(
    query: GetInterviewsQueryDto,
  ): Promise<PaginationResponseDto<InterviewResponseDto>> {
    const { page = 1, limit = 10, search, familyId, guardianId } = query;
    const skip = (page - 1) * limit;

    // Build query for families with guardians
    const queryBuilder = this.familyRepository
      .createQueryBuilder('family')
      .leftJoinAndSelect('family.familyMembers', 'familyMembers')
      .where('familyMembers.isGuardian = :isGuardian', { isGuardian: true });

    if (search) {
      queryBuilder.andWhere(
        '(family.name ILIKE :search OR familyMembers.firstName ILIKE :search OR familyMembers.lastName ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (familyId) {
      queryBuilder.andWhere('family.id = :familyId', { familyId });
    }

    if (guardianId) {
      queryBuilder.andWhere('familyMembers.id = :guardianId', { guardianId });
    }

    const [families, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const interviews: InterviewResponseDto[] = [];

    for (const family of families) {
      const guardian = family.familyMembers.find((member) => member.isGuardian);
      if (guardian) {
        const familyMembers = await this.familyMemberRepository.find({
          where: { familyId: family.id },
          relations: ['person'],
        });
        interviews.push({
          family,
          guardian,
          familyMembers,
        });
      }
    }

    return new PaginationResponseDto(interviews, total, page, limit);
  }

  async findOne(id: number): Promise<InterviewResponseDto> {
    const family = await this.familiesService.findOne(id, {
      relations: ['familyMembers'],
    });

    const guardian = family.familyMembers.find((member) => member.isGuardian);
    const familyMembers = family.familyMembers.filter(
      (member) => !member.isGuardian,
    );

    return {
      family,
      guardian,
      familyMembers,
    };
  }

  async update(
    id: number,
    updateInterviewDto: UpdateInterviewDto,
  ): Promise<InterviewResponseDto> {
    return this.familyMemberRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const family = await this.familiesService.findOne(
          id,
          { relations: ['familyMembers'] },
          entityManager,
        );

        // Update family if provided
        if (updateInterviewDto.family) {
          await this.familiesService.update(
            id,
            updateInterviewDto.family,
            entityManager,
          );
        }

        // Update guardian if provided
        if (updateInterviewDto.guardian) {
          const guardian = family.familyMembers.find(
            (member) => member.isGuardian,
          );
          if (guardian) {
            await this.familyMembersService.update(
              guardian.id,
              updateInterviewDto.guardian,
            );
          }
        }

        // Return updated interview
        return this.findOne(id);
      },
    );
  }

  async delete(id: number): Promise<void> {
    await this.familiesService.delete(id);
  }
}
