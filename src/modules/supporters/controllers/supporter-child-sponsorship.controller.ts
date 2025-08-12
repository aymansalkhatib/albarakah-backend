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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SupporterChildSponsorshipService } from '../services/supporter-child-sponsorship.service';
import { CreateSupporterChildSponsorshipDto } from '../dtos/requests/create-supporter-child-sponsorship.dto';
import { UpdateSupporterChildSponsorshipDto } from '../dtos/requests/update-supporter-child-sponsorship.dto';
import { FilterSupporterChildSponsorshipDto } from '../dtos/queries/filter-supporter-child-sponsorship.dto';
import { SupporterChildSponsorship } from '../entities/supporters-children.entity';
import { Protected } from '../../../common/decorators/protected.decorator';
import { SerializeResponse } from '../../../common/decorators/serialize-response.decorator';
import { Permission } from '../../../modules/roles/enums/permission.enum';
import { SupporterChildSponsorshipResponseDto } from '../dtos/responses/supporter-child-sponsorship-response.dto';

@Controller('supporter-child-sponsorships')
export class SupporterChildSponsorshipController {
  constructor(
    private readonly supporterChildSponsorshipService: SupporterChildSponsorshipService,
  ) {}

  @Post()
  @Protected(Permission.CREATE_SUPPORTER_CHILD_SPONSORSHIP)
  @SerializeResponse(SupporterChildSponsorshipResponseDto)
  async create(
    @Body() createDto: CreateSupporterChildSponsorshipDto,
  ): Promise<SupporterChildSponsorship> {
    return await this.supporterChildSponsorshipService.create(createDto);
  }

  @Get()
  @Protected(Permission.READ_SUPPORTER_CHILD_SPONSORSHIP)
  @SerializeResponse(SupporterChildSponsorshipResponseDto)
  async findAll(
    @Query() filterDto?: FilterSupporterChildSponsorshipDto,
  ): Promise<SupporterChildSponsorship[]> {
    return await this.supporterChildSponsorshipService.findAll(filterDto);
  }

  @Get(':id')
  @Protected(Permission.READ_SUPPORTER_CHILD_SPONSORSHIP)
  @SerializeResponse(SupporterChildSponsorshipResponseDto)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<SupporterChildSponsorship> {
    return await this.supporterChildSponsorshipService.findOne(id, {
      relations: ['supporter', 'familyMember', 'familyMember.person'],
    });
  }

  @Patch(':id')
  @Protected(Permission.UPDATE_SUPPORTER_CHILD_SPONSORSHIP)
  @SerializeResponse(SupporterChildSponsorshipResponseDto)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSupporterChildSponsorshipDto,
  ): Promise<SupporterChildSponsorship> {
    return await this.supporterChildSponsorshipService.update(id, updateDto);
  }

  @Delete(':id')
  @Protected(Permission.DELETE_SUPPORTER_CHILD_SPONSORSHIP)
  @SerializeResponse(SupporterChildSponsorshipResponseDto)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.supporterChildSponsorshipService.delete(id);
  }
}
