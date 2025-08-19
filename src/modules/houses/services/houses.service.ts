import { applyFamilyFilters } from '../../families/utils/family-filter.util';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { paginate } from '../../../common/pagination/paginate.service';
import { FamiliesService } from '../../families/services/families.service';
import { HouseQueryDto } from '../dtos/queries/house-query.dto';
import { CreateHouseDto } from '../dtos/requests/create-house.dto';
import { UpdateHouseDto } from '../dtos/requests/update-house.dto';
import { HouseResponseDto } from '../dtos/responses/house-response.dto';
import { House } from '../entities/house.entity';
import { applyHouseFilters } from '../utils/house-filter.util';

@Injectable()
export class HousesService {
  constructor(
    @InjectRepository(House)
    private readonly houseRepository: Repository<House>,

    private readonly familiesService: FamiliesService,
  ) {}

  async create(createHouseDto: CreateHouseDto): Promise<House> {
    // Check if family exists
    const family = await this.familiesService.findOne(createHouseDto.familyId);

    if (!family) {
      throw new NotFoundException(`Family with ID ${createHouseDto.familyId} not found`);
    }

    const house = this.houseRepository.create(createHouseDto);
    return await this.houseRepository.save(house);
  }

  async findAll(query: HouseQueryDto): Promise<PaginationResponseDto<HouseResponseDto>> {
    const queryBuilder = this.houseRepository
      .createQueryBuilder('house')
      .leftJoinAndSelect('house.family', 'family');

    applyHouseFilters(queryBuilder, 'house', query);
    applyFamilyFilters(queryBuilder, 'family', query);

    return paginate(queryBuilder, query, HouseResponseDto);
  }

  async findOne(id: number): Promise<House> {
    const house = await this.houseRepository.findOne({
      where: { id },
      relations: ['family'],
    });

    if (!house) {
      throw new NotFoundException(`House with ID ${id} not found`);
    }

    return house;
  }

  async update(id: number, updateHouseDto: UpdateHouseDto): Promise<House> {
    const house = await this.findOne(id);

    // If updating familyId, check if the new family exists
    if (updateHouseDto.familyId && updateHouseDto.familyId !== house.familyId) {
      const family = await this.familiesService.findOne(updateHouseDto.familyId);

      if (!family) {
        throw new NotFoundException(`Family with ID ${updateHouseDto.familyId} not found`);
      }

      // Check if the new family already has a house
      const existingHouse = await this.houseRepository.findOne({
        where: { familyId: updateHouseDto.familyId },
      });

      if (existingHouse && existingHouse.id !== id) {
        throw new BadRequestException(
          `Family with ID ${updateHouseDto.familyId} already has a house`,
        );
      }
    }

    Object.assign(house, updateHouseDto);
    return await this.houseRepository.save(house);
  }

  async delete(id: number): Promise<void> {
    const house = await this.findOne(id);
    await this.houseRepository.remove(house);
  }
}
