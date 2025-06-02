import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBeneficiaryFamilyDto } from './dto/create-beneficiary-family-dto';
import { Not, Repository } from 'typeorm';
import { BeneficiaryFamily } from './entities/beneficiary-families.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BeneficiaryFamilyResponseDto } from './dto/beneficiary-family-response.dto';
import { UpdateBeneficiaryFamilyDto } from './dto/update-beneficiary-family-dto';
import { removeUndefinedFields } from 'src/common/helpers/remove-undefined-fields.helper';
import { toDto } from 'src/common/helpers/to-dto';
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
    return beneficiaryFamily;
  }

  async create(createBeneficiaryFamilyDto: CreateBeneficiaryFamilyDto): Promise<BeneficiaryFamily> {
    // if (createBeneficiaryFamilyDto.familyBookNumber) {
    //   const existingFamily = await this.beneficiaryFamilyRepository.findOneByFamilyBookNumber(
    //     createBeneficiaryFamilyDto.familyBookNumber,
    //   );
    //   if (existingFamily) {
    //     throw new ConflictException('Family book number already exists');
    //   }
    // }

    const beneficiaryFamily = this.beneficiaryFamilyRepository.createBeneficiaryFamily(
      createBeneficiaryFamilyDto,
    );
    return beneficiaryFamily;
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

      if (existingFamily) {
        throw new ConflictException('Family book number already exists for another family');
      }
    }

    const cleanedData = removeUndefinedFields(updateBeneficiaryFamilyDto);
    const mergedData = Object.assign(beneficiaryFamily, cleanedData);
    return await this.beneficiaryFamilyRepository.updateBeneficiaryFamily(id, mergedData);
  }
}
