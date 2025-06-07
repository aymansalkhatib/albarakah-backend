import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { FilterBeneficiaryFamilyDto } from './dto/filter-beneficiary-family.dto';
import { BeneficiaryFamily } from './entities/beneficiary-families.entity';
import { CreateBeneficiaryFamilyDto } from './dto/create-beneficiary-family-dto';
import { UpdateBeneficiaryFamilyDto } from './dto/update-beneficiary-family-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BeneficiaryFamilyRepository extends Repository<BeneficiaryFamily> {
  constructor(
    @InjectRepository(BeneficiaryFamily)
    private readonly repository: Repository<BeneficiaryFamily>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  findAll(filter: FilterBeneficiaryFamilyDto): Promise<BeneficiaryFamily[]> {
    return this.find({ where: filter });
  }

  findOneByFamilyBookNumber(familyBookNumber: string): Promise<BeneficiaryFamily | undefined> {
    return this.findOneBy({ familyBookNumber });
  }

  async findOneById(id: number, options: { withDeleted?: boolean } = {}): Promise<BeneficiaryFamily | undefined> {
    const { withDeleted = false } = options;
    return this.findOne({ where: { id }, withDeleted });
  }
  createBeneficiaryFamily(
    createBeneficiaryFamilyDto: CreateBeneficiaryFamilyDto,
  ): Promise<BeneficiaryFamily> {
    const beneficiaryFamily = this.create(createBeneficiaryFamilyDto);
    return this.save(beneficiaryFamily);
  }

  updateBeneficiaryFamily(
    oldBeneficiaryFamily: BeneficiaryFamily,
    updateBeneficiaryFamilyDto: UpdateBeneficiaryFamilyDto,
  ): Promise<BeneficiaryFamily> {
    const updatedFamily = this.merge(oldBeneficiaryFamily, updateBeneficiaryFamilyDto);
    return this.save(updatedFamily);
  }

  forceDeleteBeneficiaryFamily(id: number): Promise<DeleteResult> {
    return this.delete(id);
  }

  softDeleteBeneficiaryFamily(id: number): Promise<UpdateResult> {
    return this.softDelete(id);
  }
}
