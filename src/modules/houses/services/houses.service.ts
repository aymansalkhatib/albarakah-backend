import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { House } from '../entities/house.entity';
import { Family } from '../../families/entities/families.entity';
import { CreateHouseDto } from '../dtos/requests/create-house.dto';
import { UpdateHouseDto } from '../dtos/requests/update-house.dto';
import { HouseQueryDto } from '../dtos/queries/house-query.dto';
import { FamiliesService } from '../../families/services/families.service';

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

    // Check if family already has a house
    const existingHouse = await this.houseRepository.findOne({
      where: { familyId: createHouseDto.familyId },
    });

    if (existingHouse) {
      throw new BadRequestException(
        `Family with ID ${createHouseDto.familyId} already has a house`,
      );
    }

    const house = this.houseRepository.create(createHouseDto);
    return await this.houseRepository.save(house);
  }

  async findAll(query: HouseQueryDto): Promise<House[]> {
    const queryBuilder = this.houseRepository
      .createQueryBuilder('house')
      .leftJoinAndSelect('house.family', 'family');

    if (query.familyId) {
      queryBuilder.andWhere('house.familyId = :familyId', { familyId: query.familyId });
    }

    if (query.locationText) {
      queryBuilder.andWhere('house.locationText ILIKE :locationText', {
        locationText: `%${query.locationText}%`,
      });
    }

    if (query.isRented !== undefined) {
      queryBuilder.andWhere('house.isRented = :isRented', { isRented: query.isRented });
    }

    if (query.minRentAmount !== undefined) {
      queryBuilder.andWhere('house.rentAmount >= :minRentAmount', {
        minRentAmount: query.minRentAmount,
      });
    }

    if (query.maxRentAmount !== undefined) {
      queryBuilder.andWhere('house.rentAmount <= :maxRentAmount', {
        maxRentAmount: query.maxRentAmount,
      });
    }

    queryBuilder.orderBy('house.createdAt', 'DESC');

    return await queryBuilder.getMany();
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

  async remove(id: number): Promise<void> {
    const house = await this.findOne(id);
    await this.houseRepository.remove(house);
  }
}
