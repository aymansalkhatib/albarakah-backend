import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Not, Repository } from 'typeorm';
import { FamilyRelationType } from '../../../modules/family-members/enums/family-relation-type.enum';
import { FamilyMembersService } from '../../../modules/family-members/services/family-members.service';
import { applyPersonFilters } from '../../../modules/persons/utils/person-filter.util';
import { FilterSupporterChildSponsorshipDto } from '../dtos/queries/filter-supporter-child-sponsorship.dto';
import { CreateSupporterChildSponsorshipDto } from '../dtos/requests/create-supporter-child-sponsorship.dto';
import { UpdateSupporterChildSponsorshipDto } from '../dtos/requests/update-supporter-child-sponsorship.dto';
import { SupporterChildSponsorship } from '../entities/supporters-children.entity';
import { SponsorshipStatus } from '../enums/sponsorship-status.enum';
import { applySupporterChildSponsorshipFilters } from '../utils/supporter-child-sponsorship-filter.util';

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

    // Apply supporter child sponsorship filters
    applySupporterChildSponsorshipFilters(queryBuilder, 'sponsorship', filterDto);

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
