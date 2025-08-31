import { ConflictException } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';
import { CreatePersonDto } from '../dtos/requests/create-person.dto';
import { UpdatePersonDto } from '../dtos/requests/update-person.dto';
import { Person } from '../entities/person.entity';

export async function validatePersonUniqueness(
  translateHelper: TranslateHelper,
  personRepository: Repository<Person>,
  dto: CreatePersonDto | UpdatePersonDto,
  excludeId?: number,
): Promise<void> {
  const conditions = [];

  // Check for full name
  if (dto.fullName) {
    conditions.push({
      fullName: dto.fullName,
    });
  }

  // Check for national ID
  if (dto.nationalId) {
    conditions.push({ nationalId: dto.nationalId });
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
    // Check for national ID conflict
    if (dto.nationalId && existingPerson.nationalId === dto.nationalId) {
      throw new ConflictException(
        translateHelper.tr('persons.errors.national_id_exists'),
      );
    }

    // Check for name conflict
    if (dto.fullName && existingPerson.fullName === dto.fullName) {
      throw new ConflictException(
        translateHelper.tr('persons.errors.full_name_exists'),
      );
    }

    // Generic fallback error
    throw new ConflictException(
      translateHelper.tr('persons.errors.person_details_exists'),
    );
  }
}
