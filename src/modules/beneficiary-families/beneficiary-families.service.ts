import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBeneficiaryFamilyDto } from './dto/create-beneficiary-family-dto';
import { BeneficiaryFamily } from './entities/beneficiary-families.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateBeneficiaryFamilyDto } from './dto/update-beneficiary-family-dto';
import { FilterBeneficiaryFamilyDto } from './dto/filter-beneficiary-family.dto';
import { BeneficiaryFamilyRepository } from './beneficiary-family.repository';

@Injectable()
export class BeneficiaryFamiliesService {
  constructor(
    @InjectRepository(BeneficiaryFamilyRepository)
    private readonly beneficiaryFamilyRepository: BeneficiaryFamilyRepository,
  ) {}

  async findAll(filter: FilterBeneficiaryFamilyDto): Promise<BeneficiaryFamily[]> {
    return this.beneficiaryFamilyRepository.findAll(filter);
  }

  async findOne(id: number): Promise<BeneficiaryFamily> {
    const beneficiaryFamily = await this.beneficiaryFamilyRepository.findOneById(id);
    if (!beneficiaryFamily) {
      throw new NotFoundException('Beneficiary family not found');
    }
    return beneficiaryFamily;
  }

  async create(createBeneficiaryFamilyDto: CreateBeneficiaryFamilyDto): Promise<BeneficiaryFamily> {
    if (createBeneficiaryFamilyDto.familyBookNumber) {
      const existingFamily = await this.beneficiaryFamilyRepository.findOneByFamilyBookNumber(
        createBeneficiaryFamilyDto.familyBookNumber,
      );
      if (existingFamily) {
        throw new ConflictException('Family book number already exists');
      }
    }
    return this.beneficiaryFamilyRepository.createBeneficiaryFamily(createBeneficiaryFamilyDto);
  }

  async update(
    id: number,
    updateBeneficiaryFamilyDto: UpdateBeneficiaryFamilyDto,
  ): Promise<BeneficiaryFamily> {
    const beneficiaryFamily = await this.beneficiaryFamilyRepository.findOneById(id);

    if (!beneficiaryFamily) {
      throw new NotFoundException('Beneficiary family not found');
    }

    if (updateBeneficiaryFamilyDto.familyBookNumber) {
      const existingFamily = await this.beneficiaryFamilyRepository.findOneByFamilyBookNumber(
        updateBeneficiaryFamilyDto.familyBookNumber,
      );

      if (existingFamily && existingFamily.id !== id) {
        throw new ConflictException('Family book number already exists for another family');
      }
    }

    return await this.beneficiaryFamilyRepository.updateBeneficiaryFamily(
      beneficiaryFamily,
      updateBeneficiaryFamilyDto,
    );
  }

  async remove(id: number): Promise<void> {
    const beneficiaryFamily = await this.findOne(id);
    await this.beneficiaryFamilyRepository.softRemove(beneficiaryFamily);
  }

  async forceDelete(id: number): Promise<void> {
    await this.findOne(id);
    await this.beneficiaryFamilyRepository.delete(id);
  }

  async restore(id: number): Promise<void> {
    const beneficiaryFamily = await this.beneficiaryFamilyRepository.findOneById(id, {
      withDeleted: true,
    });
    if (!beneficiaryFamily) {
      throw new NotFoundException('Beneficiary family not found');
    }
    if (!beneficiaryFamily.deletedAt) {
      throw new ConflictException('Beneficiary family is not deleted');
    }
    await this.beneficiaryFamilyRepository.restore(beneficiaryFamily.id);
  }
}
