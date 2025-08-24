import { applyFamilyFilters } from '../../families/utils/family-filter.util';
import { applyPersonFilters } from '../../persons/utils/person-filter.util';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { paginate } from '../../../common/pagination/paginate.service';
import { PersonRelation } from '../../../modules/persons/enums/person-relation.enum';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';
import { Person } from '../../persons/entities/person.entity';
import { PersonsService } from '../../persons/services/persons.service';
import { FilterGuardianDto } from '../dtos/queries/filter-guardian.dto';
import { CreateGuardianDto } from '../dtos/requests/create-guardian.dto';
import { UpdateGuardianDto } from '../dtos/requests/update-guardian.dto';
import { GuardianResponseDto } from '../dtos/responses/guardian-response.dto';
import { Guardian } from '../entities/guardian.entity';
import { applyGuardianFilters } from '../utils/guardian-filter.util';

@Injectable()
export class GuardiansService {
  constructor(
    @InjectRepository(Guardian)
    private readonly guardianRepository: Repository<Guardian>,
    private readonly personsService: PersonsService,
    private readonly translateHelper: TranslateHelper,
  ) {}

  async create(
    createGuardianDto: CreateGuardianDto,
    entityManager?: EntityManager,
  ): Promise<Guardian> {
    if (entityManager) {
      // If an entityManager is provided, use it directly (assume already in a transaction)
      return await this.createWithManager(createGuardianDto, entityManager);
    } else {
      // Otherwise, start a transaction
      return await this.guardianRepository.manager.transaction(async (manager) => {
        return await this.createWithManager(createGuardianDto, manager);
      });
    }
  }

  private async createWithManager(
    createGuardianDto: CreateGuardianDto,
    entityManager: EntityManager,
  ): Promise<Guardian> {
    const guardianRepository = entityManager.getRepository(Guardian);

    let person: Person;

    if (createGuardianDto.personId) {
      person = await this.personsService.findOne(
        createGuardianDto.personId,
        { relations: ['guardian'] },
        entityManager,
      );

      if (person.guardian) {
        throw new ConflictException(this.translateHelper.tr('guardians.errors.already_guardian'));
      }
    } else {
      person = await this.personsService.create(createGuardianDto.person, entityManager);
    }

    const guardian = guardianRepository.create({ ...createGuardianDto, person });
    return await guardianRepository.save(guardian);
  }

  async findAll(filterDto: FilterGuardianDto): Promise<PaginationResponseDto<GuardianResponseDto>> {
    const queryBuilder = this.guardianRepository
      .createQueryBuilder('guardian')
      .leftJoinAndSelect('guardian.person', 'person')
      .leftJoinAndSelect('guardian.family', 'family');

    applyPersonFilters(queryBuilder, 'person', filterDto);
    applyGuardianFilters(queryBuilder, 'guardian', filterDto);
    applyFamilyFilters(queryBuilder, 'family', filterDto);

    return paginate(queryBuilder, filterDto, GuardianResponseDto);
  }

  async findOne(
    id: number,
    { relations }: { relations?: string[] } = {},
    entityManager?: EntityManager,
  ): Promise<Guardian> {
    const guardianRepository = entityManager?.getRepository(Guardian) ?? this.guardianRepository;

    const guardian = await guardianRepository.findOne({
      where: { id },
      relations: relations,
    });

    if (!guardian) {
      throw new NotFoundException(this.translateHelper.tr('guardians.errors.not_found', { id }));
    }

    return guardian;
  }

  async update(id: number, updateGuardianDto: UpdateGuardianDto): Promise<Guardian> {
    return await this.guardianRepository.manager.transaction(async (manager) => {
      const guardianRepository = manager.getRepository(Guardian);

      const guardian = await this.findOne(id, { relations: ['person', 'family'] }, manager);

      if (updateGuardianDto.person) {
        guardian.person = await this.personsService.update(
          guardian.person.id,
          updateGuardianDto.person,
        );
        delete updateGuardianDto.person;
      }

      guardianRepository.merge(guardian, updateGuardianDto);
      return await guardianRepository.save(guardian);
    });
  }

  async delete(id: number): Promise<void> {
    const guardian = await this.findOne(id);
    await this.guardianRepository.delete(id);
    await this.personsService.deleteIf(guardian.personId, PersonRelation.GUARDIAN);
  }
}
