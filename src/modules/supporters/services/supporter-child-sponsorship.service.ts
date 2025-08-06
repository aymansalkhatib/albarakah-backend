import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Not, Repository } from 'typeorm';
import { SupporterChildSponsorship } from '../entities/supporters-children.entity';
import { CreateSupporterChildSponsorshipDto } from '../dtos/requests/create-supporter-child-sponsorship.dto';
import { UpdateSupporterChildSponsorshipDto } from '../dtos/requests/update-supporter-child-sponsorship.dto';
import { FilterSupporterChildSponsorshipDto } from '../dtos/queries/filter-supporter-child-sponsorship.dto';
import { SponsorshipStatus } from '../enums/sponsorship-status.enum';
import { FamilyMembersService } from '@app/modules/family-members/services/family-members.service';
import { FamilyRelationType } from '@app/modules/family-members/enums/family-relation-type.enum';
import { applyPersonFilters } from '@app/modules/persons/utils/person-filter.util';

@Injectable()
export class SupporterChildSponsorshipService {
  constructor(
    @InjectRepository(SupporterChildSponsorship)
    private readonly supporterChildSponsorshipRepository: Repository<SupporterChildSponsorship>,
    private readonly familyMembersService: FamilyMembersService,
  ) {}

  async create(createDto: CreateSupporterChildSponsorshipDto): Promise<SupporterChildSponsorship> {
    const familyMember = await this.familyMembersService.findOne(createDto.familyMemberId);

    if (
      familyMember.relationType != FamilyRelationType.DAUGHTER &&
      familyMember.relationType != FamilyRelationType.SON
    ) {
      throw new ConflictException('Only children (son or daughter) can be sponsored');
    }

    const existingActiveSponsorship = await this.supporterChildSponsorshipRepository.findOne({
      where: {
        familyMemberId: createDto.familyMemberId,
        sponsorshipStatus: SponsorshipStatus.ACTIVE,
      },
    });

    if (existingActiveSponsorship) {
      throw new ConflictException('This child already has an active sponsorship');
    }

    const sponsorship = this.supporterChildSponsorshipRepository.create(createDto);
    return await this.supporterChildSponsorshipRepository.save(sponsorship);
  }

  async findAll(
    filterDto?: FilterSupporterChildSponsorshipDto,
  ): Promise<SupporterChildSponsorship[]> {
    const queryBuilder = this.supporterChildSponsorshipRepository
      .createQueryBuilder('sponsorship')
      .leftJoinAndSelect('sponsorship.supporter', 'supporter')
      .leftJoinAndSelect('sponsorship.familyMember', 'familyMember')
      .leftJoinAndSelect('familyMember.person', 'person');

    // Filter by supporterId
    if (filterDto?.supporterId) {
      queryBuilder.andWhere('sponsorship.supporterId = :supporterId', {
        supporterId: filterDto.supporterId,
      });
    }

    // Filter by familyMemberId
    if (filterDto?.familyMemberId) {
      queryBuilder.andWhere('sponsorship.familyMemberId = :familyMemberId', {
        familyMemberId: filterDto.familyMemberId,
      });
    }

    // Filter by sponsorshipStatus
    if (filterDto?.sponsorshipStatus) {
      queryBuilder.andWhere('sponsorship.sponsorshipStatus = :sponsorshipStatus', {
        sponsorshipStatus: filterDto.sponsorshipStatus,
      });
    }

    // Filter by sponsorshipStartDate (greater than or equal)
    if (filterDto?.sponsorshipStartDate) {
      queryBuilder.andWhere('sponsorship.sponsorshipStartDate >= :sponsorshipStartDate', {
        sponsorshipStartDate: filterDto.sponsorshipStartDate,
      });
    }

    // Filter by sponsorshipEndDate (less than or equal)
    if (filterDto?.sponsorshipEndDate) {
      queryBuilder.andWhere('sponsorship.sponsorshipEndDate <= :sponsorshipEndDate', {
        sponsorshipEndDate: filterDto.sponsorshipEndDate,
      });
    }

    // Filter by person fields if provided
    if (filterDto?.person) {
      applyPersonFilters(queryBuilder, 'person', filterDto.person);
    }

    return await queryBuilder.getMany();
  }

  async findOne(
    id: number,
    options: FindOneOptions<SupporterChildSponsorship> = {},
  ): Promise<SupporterChildSponsorship> {
    const sponsorship = await this.supporterChildSponsorshipRepository.findOne({
      where: { id },
      ...options,
    });

    if (!sponsorship) {
      throw new NotFoundException(`Supporter child sponsorship with ID ${id} not found`);
    }

    return sponsorship;
  }

  async update(
    id: number,
    updateDto: UpdateSupporterChildSponsorshipDto,
  ): Promise<SupporterChildSponsorship> {
    const sponsorship = await this.findOne(id);

    if (updateDto.sponsorshipStatus === SponsorshipStatus.ACTIVE) {
      const existingActiveSponsorship = await this.supporterChildSponsorshipRepository.findOne({
        where: {
          familyMemberId: sponsorship.familyMemberId,
          sponsorshipStatus: SponsorshipStatus.ACTIVE,
          id: Not(id), // Exclude current sponsorship
        },
      });

      if (existingActiveSponsorship) {
        throw new ConflictException('The selected child already has an active sponsorship.');
      }
    }

    this.supporterChildSponsorshipRepository.merge(sponsorship, updateDto);
    return await this.supporterChildSponsorshipRepository.save(sponsorship);
  }

  async delete(id: number): Promise<void> {
    const result = await this.supporterChildSponsorshipRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Supporter child sponsorship with ID ${id} not found`);
    }
  }
}
