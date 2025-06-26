import { BadRequestException, ConflictException } from '@nestjs/common';
import { UpdatePersonDto } from '../dtos/requests/update-person.dto';
import { Person } from '../entities/person.entity';
import { Not, Repository } from 'typeorm';
import { CreatePersonDto } from '../dtos/requests/create-person.dto';
import { TranslateHelper } from '@app/shared/modules/app-i18n/translate.helper';

export async function validatePersonUniqueness(
  translateHelper: TranslateHelper,
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

  if (dto.firstName && dto.lastName) {
    const additionalFields = ['fatherId', 'motherId', 'birthDate'];

    additionalFields.forEach((field) => {
      if (dto[field]) {
        conditions.push({
          firstName: dto.firstName,
          lastName: dto.lastName,
          [field]: dto[field],
        });
      }
    });

    conditions.push({
      firstName: dto.firstName,
      lastName: dto.lastName,
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
      throw new ConflictException(
        translateHelper.tr('persons.errors.email_exists', { email: dto.email }),
      );
    }

    if (dto.nationalId && existingPerson.nationalId === dto.nationalId) {
      throw new ConflictException(
        translateHelper.tr('persons.errors.national_id_exists', { nationalId: dto.nationalId }),
      );
    }

    // Check for father-based conflict
    if (
      existingPerson.fatherId === dto.fatherId &&
      existingPerson.firstName === dto.firstName &&
      existingPerson.lastName === dto.lastName
    ) {
      throw new ConflictException(
        translateHelper.tr('persons.errors.father_name_exists', {
          firstName: dto.firstName,
          lastName: dto.lastName,
        }),
      );
    }

    // Check for mother-based conflict
    if (
      existingPerson.motherId === dto.motherId &&
      existingPerson.firstName === dto.firstName &&
      existingPerson.lastName === dto.lastName
    ) {
      throw new ConflictException(
        translateHelper.tr('persons.errors.mother_name_exists', {
          firstName: dto.firstName,
          lastName: dto.lastName,
        }),
      );
    }

    // Name and birthDate-based uniqueness conflict
    const existingBirthDate = existingPerson.birthDate
      ? new Date(existingPerson.birthDate).toISOString().split('T')[0]
      : undefined;
    const dtoBirthDate = dto.birthDate
      ? new Date(dto.birthDate).toISOString().split('T')[0]
      : undefined;

    if (
      existingBirthDate &&
      dtoBirthDate &&
      existingBirthDate === dtoBirthDate &&
      existingPerson.firstName === dto.firstName &&
      existingPerson.lastName === dto.lastName
    ) {
      throw new ConflictException(
        translateHelper.tr('persons.errors.name_birthdate_exists', {
          firstName: dto.firstName,
          lastName: dto.lastName,
          birthDate: dtoBirthDate,
        }),
      );
    }

    // Check for name + no parent info conflict
    console.log(existingPerson.fatherId);
    console.log(existingPerson.motherId);
    console.log(existingPerson.firstName);
    console.log(existingPerson.lastName);

    if (
      existingPerson.fatherId == null &&
      existingPerson.motherId == null &&
      existingPerson.firstName === dto.firstName &&
      existingPerson.lastName === dto.lastName
    ) {
      throw new ConflictException(
        translateHelper.tr('persons.errors.name_no_parent_exists', {
          firstName: dto.firstName,
          lastName: dto.lastName,
        }),
      );
    }

    // Generic fallback error
    throw new ConflictException(translateHelper.tr('persons.errors.person_details_exists'));
  }
}

export function validateFamilyRelationships(
  translateHelper: TranslateHelper,
  id?: number,
  dto?: UpdatePersonDto,
  person?: Person,
): void {
  const finalFatherId = dto?.fatherId !== undefined ? dto?.fatherId : person?.fatherId;
  const finalMotherId = dto?.motherId !== undefined ? dto?.motherId : person?.motherId;

  if (finalFatherId === id) {
    throw new BadRequestException(translateHelper.tr('persons.errors.self_father'));
  }

  if (finalMotherId === id) {
    throw new BadRequestException(translateHelper.tr('persons.errors.self_mother'));
  }

  if (finalFatherId && finalMotherId && finalFatherId === finalMotherId) {
    throw new BadRequestException(translateHelper.tr('persons.errors.same_father_mother'));
  }
}
