import { BadRequestException, ConflictException } from '@nestjs/common';
import { UpdatePersonDto } from '../dtos/requests/update-person.dto';
import { Person } from '../entities/person.entity';
import { Not, Repository } from 'typeorm';
import { CreatePersonDto } from '../dtos/requests/create-person.dto';

export async function validatePersonUniqueness(
  personRepository: Repository<Person>,
  dto: CreatePersonDto | UpdatePersonDto,
  excludeId?: number,
): Promise<void> {
  const conditions = [];

  // Email uniqueness check
  if (dto.email) {
    conditions.push({ email: dto.email });
  }

  // National ID uniqueness check
  if (dto.nationalId) {
    conditions.push({ nationalId: dto.nationalId });
  }

  if (dto.firstName || dto.lastName || dto.motherId || dto.fatherId) {
    // Name + Father combination check
    conditions.push({
      firstName: dto.firstName,
      lastName: dto.lastName,
      fatherId: dto.fatherId,
    });

    // Name + Mother combination check
    conditions.push({
      firstName: dto.firstName,
      lastName: dto.lastName,
      motherId: dto.motherId,
    });
  }

  if (conditions.length === 0) return;

  // Apply exclude ID filter to all conditions
  const whereConditions = conditions.map((condition) => ({
    ...condition,
    ...(excludeId && { id: Not(excludeId) }),
  }));

  const existingPerson = await personRepository.findOne({
    where: whereConditions,
  });

  if (existingPerson) {
    // Provide specific error messages based on conflict type
    if (dto.email && existingPerson.email === dto.email) {
      throw new ConflictException(`A person with email "${dto.email}" already exists`);
    }

    if (dto.nationalId && existingPerson.nationalId === dto.nationalId) {
      throw new ConflictException(`A person with national ID "${dto.nationalId}" already exists`);
    }

    // Check for father-based conflict
    if (
      existingPerson.fatherId === dto.fatherId &&
      existingPerson.firstName === dto.firstName &&
      existingPerson.lastName === dto.lastName
    ) {
      throw new ConflictException(
        `A person named "${dto.firstName} ${dto.lastName}" with the same father already exists`,
      );
    }

    // Check for mother-based conflict
    if (
      existingPerson.motherId === dto.motherId &&
      existingPerson.firstName === dto.firstName &&
      existingPerson.lastName === dto.lastName
    ) {
      throw new ConflictException(
        `A person named "${dto.firstName} ${dto.lastName}" with the same mother already exists`,
      );
    }

    // Check for name + no parent info conflict
    if (
      existingPerson.fatherId == null &&
      existingPerson.motherId == null &&
      existingPerson.firstName === dto.firstName &&
      existingPerson.lastName === dto.lastName
    ) {
      throw new ConflictException(
        `A person named "${dto.firstName} ${dto.lastName}" already exists in the system without any parent information. ` +
          `To differentiate between individuals with the same name, please provide either the father's ID or the mother's ID.`,
      );
    }

    // Generic fallback error
    throw new ConflictException(`A person with these details already exists`);
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
