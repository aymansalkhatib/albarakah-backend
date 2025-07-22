import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFamilyMemberDto } from '../dtos/create-family-member.dto';
import { FamilyMember } from '../entities/family-members.entity';
import { FamilyRelationType } from '../enums/family-relation-type.enum';
import { FamiliesService } from './beneficiary-families.service';
import { FamilyMemberRepository } from '../repositories/family-member.repository';

@Injectable()
export class FamilyMembersService {
  constructor(
    private readonly familyMemberRepository: FamilyMemberRepository,
    private readonly beneficiaryFamiliesService: FamiliesService,
  ) {}

  async findAll(): Promise<FamilyMember[]> {
    return this.familyMemberRepository.find({
      relations: ['person', 'family'],
    });
  }

  async findOne(id: number): Promise<FamilyMember> {
    const familyMember = await this.familyMemberRepository.findOneById(id);
    if (!familyMember) {
      throw new NotFoundException('Family member not found');
    }
    return familyMember;
  }

  async findByFamilyId(familyId: number): Promise<FamilyMember[]> {
    await this.validateFamilyExists(familyId);
    return this.familyMemberRepository.findByFamilyId(familyId);
  }

  async findByPersonId(personId: number): Promise<FamilyMember[]> {
    return this.familyMemberRepository.findByPersonId(personId);
  }

  async create(createFamilyMemberDto: CreateFamilyMemberDto): Promise<FamilyMember> {
    await this.validateFamilyExists(createFamilyMemberDto.familyId);
    await this.validateUniquePersonInFamily(
      createFamilyMemberDto.personId,
      createFamilyMemberDto.familyId,
    );
    await this.validateParentCount(createFamilyMemberDto);

    return this.familyMemberRepository.createFamilyMember(createFamilyMemberDto);
  }

  async update(id: number, updateData: Partial<CreateFamilyMemberDto>): Promise<FamilyMember> {
    const familyMember = await this.findOne(id);

    if (updateData.familyId) {
      await this.validateFamilyExists(updateData.familyId);
    }

    if (updateData.personId) {
      await this.validateUniquePersonInFamily(
        updateData.personId,
        updateData.familyId || familyMember.familyId,
      );
    }

    if (updateData.relationType) {
      await this.validateParentCount({
        ...familyMember,
        ...updateData,
      });
    }

    return this.familyMemberRepository.updateFamilyMember(id, updateData);
  }

  async delete(id: number): Promise<void> {
    const familyMember = await this.findOne(id);
    await this.familyMemberRepository.deleteFamilyMember(id);
  }

  async forceDelete(id: number): Promise<void> {
    const familyMember = await this.findOne(id);
    await this.familyMemberRepository.forceDeleteFamilyMember(id);
  }

  async findParentsByFamilyId(familyId: number): Promise<FamilyMember[]> {
    await this.validateFamilyExists(familyId);
    return this.familyMemberRepository.findParentsByFamilyId(familyId);
  }

  async findChildrenByFamilyId(familyId: number): Promise<FamilyMember[]> {
    await this.validateFamilyExists(familyId);
    return this.familyMemberRepository.findChildrenByFamilyId(familyId);
  }

  private async validateFamilyExists(familyId: number): Promise<void> {
    try {
      await this.beneficiaryFamiliesService.findOne(familyId);
    } catch (error) {
      throw new NotFoundException('Family not found');
    }
  }

  private async validateUniquePersonInFamily(personId: number, familyId: number): Promise<void> {
    const existingMembers = await this.familyMemberRepository.findByPersonId(personId);
    const isPersonInFamily = existingMembers.some((member) => member.familyId === familyId);

    if (isPersonInFamily) {
      throw new ConflictException('Person is already a member of this family');
    }
  }

  private async validateParentCount(familyMember: CreateFamilyMemberDto): Promise<void> {
    if (
      [FamilyRelationType.MOTHER, FamilyRelationType.FATHER].includes(familyMember.relationType)
    ) {
      const parents = await this.familyMemberRepository.findByFamilyIdAndRelationType(
        familyMember.familyId,
        familyMember.relationType,
      );

      if (parents.length > 0) {
        throw new ConflictException(
          `Family already has a ${familyMember.relationType.toLowerCase()}`,
        );
      }
    }
  }
}
