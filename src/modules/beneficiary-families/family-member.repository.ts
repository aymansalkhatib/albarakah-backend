import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FamilyMember } from './entities/family-members.entity';
import { CreateFamilyMemberDto } from './dto/create-family-member.dto';
import { FamilyRelationType } from './enums/family-relation-type.enum';
import { In } from 'typeorm';

@Injectable()
export class FamilyMemberRepository extends Repository<FamilyMember> {
  constructor(
    @InjectRepository(FamilyMember)
    private readonly repository: Repository<FamilyMember>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findOneById(id: number): Promise<FamilyMember | undefined> {
    return this.findOne({
      where: { id },
      relations: ['person', 'family'],
    });
  }

  async findByFamilyId(familyId: number): Promise<FamilyMember[]> {
    return this.find({
      where: { familyId },
      relations: ['person'],
      order: {
        relationType: 'ASC',
      },
    });
  }

  async findByPersonId(personId: number): Promise<FamilyMember[]> {
    return this.find({
      where: { personId },
      relations: ['family'],
    });
  }

  async findByFamilyIdAndRelationType(
    familyId: number,
    relationType: FamilyRelationType,
  ): Promise<FamilyMember[]> {
    return this.find({
      where: { familyId, relationType },
      relations: ['person'],
    });
  }

  async createFamilyMember(createFamilyMemberDto: CreateFamilyMemberDto): Promise<FamilyMember> {
    const familyMember = this.create(createFamilyMemberDto);
    return this.save(familyMember);
  }

  async updateFamilyMember(
    id: number,
    updateData: Partial<CreateFamilyMemberDto>,
  ): Promise<FamilyMember> {
    await this.update(id, updateData);
    return this.findOneById(id);
  }

  async deleteFamilyMember(id: number): Promise<void> {
    await this.softDelete(id);
  }

  async forceDeleteFamilyMember(id: number): Promise<void> {
    await this.delete(id);
  }

  async findParentsByFamilyId(familyId: number): Promise<FamilyMember[]> {
    return this.find({
      where: {
        familyId,
        relationType: In([FamilyRelationType.MOTHER, FamilyRelationType.FATHER]),
      },
      relations: ['person'],
    });
  }

  async findChildrenByFamilyId(familyId: number): Promise<FamilyMember[]> {
    return this.find({
      where: {
        familyId,
        relationType: In([FamilyRelationType.SON, FamilyRelationType.DAUGHTER]),
      },
      relations: ['person'],
    });
  }
}
