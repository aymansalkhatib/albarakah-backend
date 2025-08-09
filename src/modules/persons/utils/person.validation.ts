import { ConflictException } from '@nestjs/common';
import { UpdatePersonDto } from '../dtos/requests/update-person.dto';
import { Person } from '../entities/person.entity';
import { Not, Repository } from 'typeorm';
import { CreatePersonDto } from '../dtos/requests/create-person.dto';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';
import { DropdownService } from '../../../modules/dropdowns/services/dropdown.service';
import { PersonDropdown } from '../enums/type-dropdown.enum';

export async function validatePersonUniqueness(
  translateHelper: TranslateHelper,
  personRepository: Repository<Person>,
  dto: CreatePersonDto | UpdatePersonDto,
  excludeId?: number,
): Promise<void> {
  const conditions = [];

  if (dto.firstName && dto.lastName) {
    const additionalFields = ['fatherName'];

    additionalFields.forEach((field) => {
      if (dto[field]) {
        conditions.push({
          firstName: dto.firstName,
          lastName: dto.lastName,
          [field]: dto[field],
        });
      }
    });

    if (conditions.length === 0) {
      conditions.push({
        firstName: dto.firstName,
        lastName: dto.lastName,
      });
    }
  }

  // Email uniqueness check
  if (dto.email) {
    conditions.push({ email: dto.email });
  }

  // National ID uniqueness check
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

    if (
      existingPerson.fatherName == null &&
      dto.fatherName == null &&
      existingPerson.firstName === dto.firstName &&
      existingPerson.lastName === dto.lastName
    ) {
      throw new ConflictException(translateHelper.tr('persons.errors.name_no_parent_exists'));
    }

    // Check for father-based conflict
    if (
      existingPerson.fatherName === dto.fatherName &&
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

    // Generic fallback error
    throw new ConflictException(translateHelper.tr('persons.errors.person_details_exists'));
  }
}

export async function validateDropdownFields(
  dto: CreatePersonDto | UpdatePersonDto,
  dropdownService: DropdownService,
) {
  if (dto.healthStatusId) {
    await dropdownService.findDropdownWithOptionCheck({
      categoryName: Person.name,
      dropdownName: PersonDropdown.HEALTH_STATUS,
      optionId: dto.healthStatusId,
    });
  }

  if (dto.educationLevelId) {
    await dropdownService.findDropdownWithOptionCheck({
      categoryName: Person.name,
      dropdownName: PersonDropdown.EDUCATION_LEVEL,
      optionId: dto.educationLevelId,
    });
  }

  if (dto.schoolTypeId) {
    await dropdownService.findDropdownWithOptionCheck({
      categoryName: Person.name,
      dropdownName: PersonDropdown.SCHOOL_TYPE,
      optionId: dto.schoolTypeId,
    });
  }

  if (dto.personStatusId) {
    await dropdownService.findDropdownWithOptionCheck({
      categoryName: Person.name,
      dropdownName: PersonDropdown.PERSON_STATUS,
      optionId: dto.personStatusId,
    });
  }

  if (dto.maritalStatusId) {
    await dropdownService.findDropdownWithOptionCheck({
      categoryName: Person.name,
      dropdownName: PersonDropdown.MARITAL_STATUS,
      optionId: dto.maritalStatusId,
    });
  }

  if (dto.gradeLevelId) {
    await dropdownService.findDropdownWithOptionCheck({
      categoryName: Person.name,
      dropdownName: PersonDropdown.GRADE_LEVEL,
      optionId: dto.gradeLevelId,
    });
  }
}
