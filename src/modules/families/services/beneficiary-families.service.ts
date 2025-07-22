import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFamilyDto } from '../dtos/create-family-dto';
import { FilterFamilyDto } from '../dtos/filter-family.dto';
import { UpdateFamilyDto } from '../dtos/update-family-dto';
import { Family } from '../entities/families.entity';
import { FamilyRepository } from '../repositories/family.repository';

@Injectable()
export class FamiliesService {
  constructor(
    @InjectRepository(FamilyRepository)
    private readonly familyRepository: FamilyRepository,
  ) {}

  async findAll(filter: FilterFamilyDto): Promise<Family[]> {
    return this.familyRepository.findAll(filter);
  }

  async findOne(id: number): Promise<Family> {
    const beneficiaryFamily = await this.familyRepository.findOneById(id);
    if (!beneficiaryFamily) {
      throw new NotFoundException('Beneficiary family not found');
    }
    return beneficiaryFamily;
  }

  async create(createBeneficiaryFamilyDto: CreateFamilyDto): Promise<Family> {
    if (createBeneficiaryFamilyDto.familyBookNumber) {
      const existingFamily = await this.familyRepository.findOneByFamilyBookNumber(
        createBeneficiaryFamilyDto.familyBookNumber,
      );
      if (existingFamily) {
        throw new ConflictException('Family book number already exists');
      }
    }
    return this.familyRepository.createBeneficiaryFamily(createBeneficiaryFamilyDto);
  }

  async update(id: number, updateBeneficiaryFamilyDto: UpdateFamilyDto): Promise<Family> {
    const beneficiaryFamily = await this.familyRepository.findOneById(id);

    if (!beneficiaryFamily) {
      throw new NotFoundException('Beneficiary family not found');
    }

    if (updateBeneficiaryFamilyDto.familyBookNumber) {
      const existingFamily = await this.familyRepository.findOneByFamilyBookNumber(
        updateBeneficiaryFamilyDto.familyBookNumber,
      );

      if (existingFamily && existingFamily.id !== id) {
        throw new ConflictException('Family book number already exists for another family');
      }
    }

    return await this.familyRepository.updateBeneficiaryFamily(
      beneficiaryFamily,
      updateBeneficiaryFamilyDto,
    );
  }

  async forceDelete(id: number): Promise<void> {
    const result = await this.familyRepository.forceDelete(id);
    if (!result.affected) {
      throw new NotFoundException('Beneficiary family not found');
    }
  }
}
