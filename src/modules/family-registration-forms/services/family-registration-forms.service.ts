import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FamilyRegistrationForm } from '../entities/family-registration-form.entity';
import { CreateFamilyRegistrationFormDto } from '../dtos/requests/create-family-registration-form.dto';
import { UpdateFamilyRegistrationFormDto } from '../dtos/requests/update-family-registration-form.dto';
import { FamilyRegistrationFormFilterDto } from '../dtos/queries/family-registration-form-filter.dto';
import { FamilyRegistrationFormResponseDto } from '../dtos/responses/family-registration-form-response.dto';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { paginate } from '../../../common/pagination/paginate.service';

@Injectable()
export class FamilyRegistrationFormsService {
  constructor(
    @InjectRepository(FamilyRegistrationForm)
    private readonly familyRegistrationFormRepository: Repository<FamilyRegistrationForm>,
  ) {}

  async create(createDto: CreateFamilyRegistrationFormDto): Promise<FamilyRegistrationForm> {
    const form = this.familyRegistrationFormRepository.create(createDto);
    return this.familyRegistrationFormRepository.save(form);
  }

  async findAll(filter: FamilyRegistrationFormFilterDto): Promise<PaginationResponseDto<FamilyRegistrationFormResponseDto>> {
    const queryBuilder = this.familyRegistrationFormRepository
      .createQueryBuilder('form')
      .leftJoinAndSelect('form.family', 'family');

    if (filter.search) {
      queryBuilder.andWhere(
        '(form.formNotes LIKE :search OR form.managementDecision LIKE :search OR family.familyName LIKE :search)',
        { search: `%${filter.search}%` }
      );
    }

    if (filter.requestStatus) {
      queryBuilder.andWhere('form.requestStatus = :requestStatus', { requestStatus: filter.requestStatus });
    }

    if (filter.familyId) {
      queryBuilder.andWhere('form.familyId = :familyId', { familyId: filter.familyId });
    }

    return paginate(queryBuilder, filter, FamilyRegistrationFormResponseDto);
  }

  async findOne(id: number): Promise<FamilyRegistrationForm> {
    const form = await this.familyRegistrationFormRepository.findOne({
      where: { id },
      relations: ['family'],
    });
    
    if (!form) {
      throw new NotFoundException('Family registration form not found');
    }
    
    return form;
  }

  async update(id: number, updateDto: UpdateFamilyRegistrationFormDto): Promise<FamilyRegistrationForm> {
    const form = await this.familyRegistrationFormRepository.findOneById(id);
    
    if (!form) {
      throw new NotFoundException('Family registration form not found');
    }

    const updatedForm = this.familyRegistrationFormRepository.merge(form, updateDto);
    return this.familyRegistrationFormRepository.save(updatedForm);
  }

  async delete(id: number): Promise<void> {
    const result = await this.familyRegistrationFormRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException('Family registration form not found');
    }
  }
}
