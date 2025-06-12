import { ConflictException, BadRequestException } from '@nestjs/common';
import { CreatePersonDto } from '../dto/create-person.dto';
import { UpdatePersonDto } from '../dto/update-person.dto';
import { Person } from '../entities/person.entity';
import { Not, Repository } from 'typeorm';

export async function validatePersonUniqueness(
  personRepository: Repository<Person>,
  dto: CreatePersonDto | UpdatePersonDto,
  excludeId?: number,
): Promise<void> {
  const conditions = [];

  if (dto.email) {
    conditions.push({ email: dto.email });
  }

  if (dto.nationalId) {
    conditions.push({ nationalId: dto.nationalId });
  }

  if (dto.firstName || dto.lastName) {
    conditions.push({
      firstName: dto.firstName,
      lastName: dto.lastName,
      birthDate: dto.birthDate,
    });
  }

  if (conditions.length === 0) return;

  const whereConditions = conditions.map((condition) => ({
    ...condition,
    ...(excludeId && { id: Not(excludeId) }),
  }));

  const existingPerson = await personRepository.findOne({
    where: whereConditions,
  });

  if (existingPerson) {
    if (existingPerson.email === dto.email) {
      throw new ConflictException(`Person with email ${dto.email} already exists`);
    }
    if (existingPerson.nationalId === dto.nationalId) {
      throw new ConflictException(`Person with national ID ${dto.nationalId} already exists`);
    }
    throw new ConflictException(
      `Person with name ${dto.firstName} ${dto.lastName} and birth date already exists`,
    );
  }
}

export function validateFamilyRelationships(
  id?: number,
  dto?: UpdatePersonDto,
  person?: Person,
): void {
  const finalFatherId = dto?.fatherId !== undefined ? dto?.fatherId : person?.fatherId;
  const finalMotherId = dto?.motherId !== undefined ? dto?.motherId : person?.motherId;

  if (finalFatherId === id) {
    throw new BadRequestException('Person cannot be their own father');
  }

  if (finalMotherId === id) {
    throw new BadRequestException('Person cannot be their own mother');
  }

  if (finalFatherId && finalMotherId && finalFatherId === finalMotherId) {
    throw new BadRequestException('Father and mother cannot be the same person');
  }
}
