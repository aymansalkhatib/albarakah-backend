import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { SupporterChildSponsorshipService } from '../services/supporter-child-sponsorship.service';
import { CreateSupporterChildSponsorshipDto } from '../dtos/requests/create-supporter-child-sponsorship.dto';
import { UpdateSupporterChildSponsorshipDto } from '../dtos/requests/update-supporter-child-sponsorship.dto';
import { FilterSupporterChildSponsorshipDto } from '../dtos/queries/filter-supporter-child-sponsorship.dto';
import { SupporterChildSponsorship } from '../entities/supporters-children.entity';

@Controller('supporter-child-sponsorships')
export class SupporterChildSponsorshipController {
  constructor(
    private readonly supporterChildSponsorshipService: SupporterChildSponsorshipService,
  ) {}

  @Post()
  async create(
    @Body() createDto: CreateSupporterChildSponsorshipDto,
  ): Promise<SupporterChildSponsorship> {
    return await this.supporterChildSponsorshipService.create(createDto);
  }

  @Get()
  async findAll(
    @Query() filterDto?: FilterSupporterChildSponsorshipDto,
  ): Promise<SupporterChildSponsorship[]> {
    return await this.supporterChildSponsorshipService.findAll(filterDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<SupporterChildSponsorship> {
    return await this.supporterChildSponsorshipService.findOne(id, {
      relations: ['supporter', 'familyMember', 'familyMember.person'],
    });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSupporterChildSponsorshipDto,
  ): Promise<SupporterChildSponsorship> {
    return await this.supporterChildSponsorshipService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.supporterChildSponsorshipService.delete(id);
  }
}
