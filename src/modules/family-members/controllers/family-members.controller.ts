import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Protected } from '../../../common/decorators/protected.decorator';
import { SerializeResponse } from '../../../common/decorators/serialize-response.decorator';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { Permission } from '../../../modules/roles/enums/permission.enum';
import { FamilyMemberFilterDto } from '../dtos/queries/family-member-filter.dto';
import { CreateFamilyMemberDto } from '../dtos/requests/create-family-member.dto';
import { UpdateFamilyMemberDto } from '../dtos/requests/update-family-member.dto';
import { FamilyMemberResponseDto } from '../dtos/responses/family-member-response.dto';
import { FamilyMembersService } from '../services/family-members.service';

@Controller('family-members')
export class FamilyMembersController {
  constructor(private readonly familyMembersService: FamilyMembersService) {}

  @Get()
  @Protected(Permission.READ_FAMILY_MEMBER)
  async findAll(
    @Query() query: FamilyMemberFilterDto,
  ): Promise<PaginationResponseDto<FamilyMemberResponseDto>> {
    return this.familyMembersService.findAll(query);
  }

  @Get(':id')
  @Protected(Permission.READ_FAMILY_MEMBER)
  @SerializeResponse(FamilyMemberResponseDto)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return await this.familyMembersService.findOneDetailed(id);
  }

  @Post()
  @Protected(Permission.CREATE_FAMILY_MEMBER)
  @SerializeResponse(FamilyMemberResponseDto)
  async create(
    @Body() createFamilyMemberDto: CreateFamilyMemberDto,
  ): Promise<FamilyMemberResponseDto> {
    return await this.familyMembersService.create(createFamilyMemberDto);
  }

  @Patch(':id')
  @Protected(Permission.UPDATE_FAMILY_MEMBER)
  @SerializeResponse(FamilyMemberResponseDto)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<UpdateFamilyMemberDto>,
  ): Promise<FamilyMemberResponseDto> {
    return await this.familyMembersService.update(id, updateData);
  }

  @Delete(':id')
  @Protected(Permission.DELETE_FAMILY_MEMBER)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.familyMembersService.delete(id);
  }
}
