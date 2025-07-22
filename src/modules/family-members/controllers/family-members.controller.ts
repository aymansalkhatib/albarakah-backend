import { toDto } from '@app/common/helpers/to-dto';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { FamilyMemberResponseDto } from '../dtos/responses/family-member-response.dto';
import { FamilyMembersService } from '../services/family-members.service';
import { CreateFamilyMemberDto } from '../dtos/requests/create-family-member.dto';

@Controller('family-members')
export class FamilyMembersController {
  constructor(private readonly familyMembersService: FamilyMembersService) {}

  @Get()
  async findAll(): Promise<FamilyMemberResponseDto[]> {
    const familyMembers = await this.familyMembersService.findAll();
    return toDto(FamilyMemberResponseDto, familyMembers);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<FamilyMemberResponseDto> {
    const familyMember = await this.familyMembersService.findOne(id);
    return toDto(FamilyMemberResponseDto, familyMember);
  }

  @Get('family/:familyId')
  async findByFamilyId(
    @Param('familyId', ParseIntPipe) familyId: number,
  ): Promise<FamilyMemberResponseDto[]> {
    const familyMembers = await this.familyMembersService.findByFamilyId(familyId);
    return toDto(FamilyMemberResponseDto, familyMembers);
  }

  @Get('person/:personId')
  async findByPersonId(
    @Param('personId', ParseIntPipe) personId: number,
  ): Promise<FamilyMemberResponseDto[]> {
    const familyMembers = await this.familyMembersService.findByPersonId(personId);
    return toDto(FamilyMemberResponseDto, familyMembers);
  }

  @Post()
  async create(
    @Body() createFamilyMemberDto: CreateFamilyMemberDto,
  ): Promise<FamilyMemberResponseDto> {
    const familyMember = await this.familyMembersService.create(createFamilyMemberDto);
    return toDto(FamilyMemberResponseDto, familyMember);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateFamilyMemberDto>,
  ): Promise<FamilyMemberResponseDto> {
    const familyMember = await this.familyMembersService.update(id, updateData);
    return toDto(FamilyMemberResponseDto, familyMember);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.familyMembersService.delete(id);
    return {
      message: 'Family member deleted successfully',
    };
  }

  @Delete(':id/force')
  async forceDelete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.familyMembersService.forceDelete(id);
    return {
      message: 'Family member permanently deleted',
    };
  }

  @Get('family/:familyId/parents')
  async findParentsByFamilyId(
    @Param('familyId', ParseIntPipe) familyId: number,
  ): Promise<FamilyMemberResponseDto[]> {
    const parents = await this.familyMembersService.findParentsByFamilyId(familyId);
    return toDto(FamilyMemberResponseDto, parents);
  }

  @Get('family/:familyId/children')
  async findChildrenByFamilyId(
    @Param('familyId', ParseIntPipe) familyId: number,
  ): Promise<FamilyMemberResponseDto[]> {
    const children = await this.familyMembersService.findChildrenByFamilyId(familyId);
    return toDto(FamilyMemberResponseDto, children);
  }
}
