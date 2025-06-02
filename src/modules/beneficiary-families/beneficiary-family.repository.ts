import {
  DataSource,
  DeleteResult,
  EntityRepository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { Repository } from 'typeorm';
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
    return this.findOne({ where: { familyBookNumber } });
  }

  findOneById(id: number): Promise<BeneficiaryFamily | undefined> {
    return this.findOne({ where: { id } });
  }

  createBeneficiaryFamily(
    createBeneficiaryFamilyDto: CreateBeneficiaryFamilyDto,
  ): Promise<BeneficiaryFamily> {
    const beneficiaryFamily = this.create(createBeneficiaryFamilyDto);
    return this.save(beneficiaryFamily);
  }

  updateBeneficiaryFamily(
    id: number,
    updateBeneficiaryFamilyDto: UpdateBeneficiaryFamilyDto,
  ): Promise<BeneficiaryFamily> {
    return this.save(updateBeneficiaryFamilyDto);
  }

  forceDeleteBeneficiaryFamily(id: number): Promise<DeleteResult> {
    return this.delete(id);
  }

  softDeleteBeneficiaryFamily(id: number): Promise<UpdateResult> {
    return this.softDelete(id);
  }
}
