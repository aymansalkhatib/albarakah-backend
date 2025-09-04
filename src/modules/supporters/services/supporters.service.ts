import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOneOptions, Repository } from 'typeorm';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { paginate } from '../../../common/pagination/paginate.service';
import { Person } from '../../../modules/persons/entities/person.entity';
import { PersonRelation } from '../../../modules/persons/enums/person-relation.enum';
import { PersonsService } from '../../../modules/persons/services/persons.service';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';
import { applyPersonFilters } from '../../persons/utils/person-filter.util';
import { FilterSupporterDto } from '../dtos/queries/filter-supporter.dto';
import { CreateSupporterDto } from '../dtos/requests/create-supporter.dto';
import { UpdateSupporterDto } from '../dtos/requests/update-supporter.dto';
import { SupporterResponseDto } from '../dtos/responses/supporter-response.dto';
import { Supporter } from '../entities/supporters.entity';
import { applySupporterFilters } from '../utils/supporter-filter.util';

@Injectable()
export class SupportersService {
  constructor(
    @InjectRepository(Supporter)
    private readonly supporterRepository: Repository<Supporter>,
    private readonly personsService: PersonsService,
    private readonly translateHelper: TranslateHelper,
  ) {}

  async create(createSupporterDto: CreateSupporterDto): Promise<Supporter> {
    return await this.supporterRepository.manager.transaction(
      async (manager) => {
        //
        const supporterRepository = manager.getRepository(Supporter);

        let person: Person;

        if (createSupporterDto.personId) {
          person = await this.personsService.findOne(
            createSupporterDto.personId,
            { relations: ['supporter'] },
            manager,
          );

          if (person.supporter) {
            throw new ConflictException(
              this.translateHelper.tr('supporters.errors.already_supporter'),
            );
          }
        } else {
          person = await this.personsService.create(
            createSupporterDto.person,
            manager,
          );
        }

        const supporter = supporterRepository.create({
          ...createSupporterDto,
          person,
        });
        //
        return await supporterRepository.save(supporter);
      },
    );
  }

  async findAll(
    filterDto: FilterSupporterDto,
  ): Promise<PaginationResponseDto<SupporterResponseDto>> {
    //
    const queryBuilder = this.supporterRepository
      .createQueryBuilder('supporter')
      .leftJoinAndSelect('supporter.person', 'person');

    // Apply person filters
    if (filterDto.person) {
      applyPersonFilters(queryBuilder, 'person', filterDto.person);
    }

    // Apply supporter filters
    applySupporterFilters(queryBuilder, 'supporter', filterDto);

    return paginate(queryBuilder, filterDto, SupporterResponseDto);
  }

  async findOne(
    id: number,
    options: FindOneOptions<Supporter> = {},

    entityManager?: EntityManager,
  ): Promise<Supporter> {
    //
    const supporterRepository = entityManager
      ? entityManager.getRepository(Supporter)
      : this.supporterRepository;

    // Find the supporter
    const supporter = await supporterRepository.findOne({
      where: { id },
      ...options,
    });

    if (!supporter) {
      throw new NotFoundException(
        this.translateHelper.tr('supporters.errors.not_found', { id }),
      );
    }

    return supporter;
  }

  async update(
    id: number,
    updateSupporterDto: UpdateSupporterDto,
  ): Promise<Supporter> {
    return await this.supporterRepository.manager.transaction(
      async (manager) => {
        const supporterRepository = manager.getRepository(Supporter);

        const supporter = await this.findOne(
          id,
          { relations: ['person'] },
          manager,
        );

        if (updateSupporterDto.person) {
          supporter.person = await this.personsService.update(
            supporter.person.id,
            updateSupporterDto.person,
            manager,
          );
          delete updateSupporterDto.person;
        }

        supporterRepository.merge(supporter, updateSupporterDto);
        return await supporterRepository.save(supporter);
      },
    );
  }

  async delete(id: number): Promise<void> {
    const supporter = await this.findOne(id);
    await this.supporterRepository.delete(id);
    await this.personsService.deleteIf(
      supporter.personId,
      PersonRelation.SUPPORTER,
    );
  }
}
