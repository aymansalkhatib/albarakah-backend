import { PersonDropdown } from '@app/modules/persons/enums/type-dropdown.enum';
import { DropdownCategory } from '../../modules/dropdowns/entities/dropdown-category.entity';
import { DropdownOption } from '../../modules/dropdowns/entities/dropdown-option.entity';
import { Dropdown, DropdownSelectionType } from '../../modules/dropdowns/entities/dropdown.entity';
import { SelectedDropdownOption } from '../../modules/dropdowns/entities/selected-dropdown-option.entity';
import { Person } from '../../modules/persons/entities/person.entity';
import { House } from '../../modules/houses/entities/house.entity';
import { QueryRunner } from 'typeorm';

export async function seedDropdowns(queryRunner: QueryRunner) {
  const selectedDropdownOptionRepo = queryRunner.manager.getRepository(SelectedDropdownOption);
  await selectedDropdownOptionRepo.deleteAll();

  const dropdownOptionRepo = queryRunner.manager.getRepository(DropdownOption);
  await dropdownOptionRepo.deleteAll();

  const dropdownRepo = queryRunner.manager.getRepository(Dropdown);
  await dropdownRepo.deleteAll();

  const categoryRepo = queryRunner.manager.getRepository(DropdownCategory);
  await categoryRepo.deleteAll();

  // Profile
  // Create a new category with the name 'profile'
  const profileCategory = await categoryRepo.create({ name: Person.name }).save();
  const homeCategory = await categoryRepo.create({ name: House.name }).save();

  // Marital Status
  const maritalStatusDropdown = dropdownRepo.create({
    dropdownName: PersonDropdown.MARITAL_STATUS,
    dropdownCategory: profileCategory,
    selectionType: DropdownSelectionType.SINGLE,
  });
  await dropdownRepo.save(maritalStatusDropdown);

  const maritalStatus = ['Single', 'Married', 'Divorced', 'Widowed'];
  for (const status of maritalStatus) {
    const option = dropdownOptionRepo.create({
      name: status,
      dropdown: maritalStatusDropdown,
    });
    await dropdownOptionRepo.save(option);
  }

  // Health Status
  const healthStatusDropdown = dropdownRepo.create({
    dropdownName: PersonDropdown.HEALTH_STATUS,
    dropdownCategory: profileCategory,
    selectionType: DropdownSelectionType.SINGLE,
  });
  await dropdownRepo.save(healthStatusDropdown);

  const healthStatus = [
    'Healthy',
    'Chronic Illness',
    'Disabled',
    'Temporarily Ill',
    'Recovering from Surgery',
    'Mental Health Condition',
    'Contagious Disease',
  ];

  for (const status of healthStatus) {
    const option = dropdownOptionRepo.create({
      name: status,
      dropdown: healthStatusDropdown,
    });
    await dropdownOptionRepo.save(option);
  }

  // Education Level
  const educationLevelDropdown = dropdownRepo.create({
    dropdownName: PersonDropdown.EDUCATION_LEVEL,
    dropdownCategory: profileCategory,
    selectionType: DropdownSelectionType.SINGLE,
  });
  await dropdownRepo.save(educationLevelDropdown);

  const educationLevels = [
    'Illiterate',
    'Primary School',
    'Middle School',
    'High School',
    'Diploma',
    "Bachelor's Degree",
    "Master's Degree",
    'Doctorate (PhD)',
  ];

  for (const level of educationLevels) {
    const option = dropdownOptionRepo.create({
      name: level,
      dropdown: educationLevelDropdown,
      isActive: true,
    });
    await dropdownOptionRepo.save(option);
  }

  // School Type
  const schoolTypeDropdown = dropdownRepo.create({
    dropdownName: PersonDropdown.SCHOOL_TYPE,
    dropdownCategory: profileCategory,
    selectionType: DropdownSelectionType.SINGLE,
  });
  await dropdownRepo.save(schoolTypeDropdown);

  const schoolTypes = [
    'Public School',
    'Private School',
    'International School',
    'Religious School',
    'Homeschooling',
    'Charter School',
    'Vocational School',
    'Online School',
  ];

  for (const type of schoolTypes) {
    const option = dropdownOptionRepo.create({
      name: type,
      dropdown: schoolTypeDropdown,
      isActive: true,
    });
    await dropdownOptionRepo.save(option);
  }

  // Grade Level
  const gradeLevelDropdown = dropdownRepo.create({
    dropdownName: PersonDropdown.GRADE_LEVEL,
    dropdownCategory: profileCategory,
    selectionType: DropdownSelectionType.SINGLE,
  });
  await dropdownRepo.save(gradeLevelDropdown);

  const gradeLevels = [
    'Kindergarten',
    '1st Grade',
    '2nd Grade',
    '3rd Grade',
    '4th Grade',
    '5th Grade',
    '6th Grade',
    '7th Grade',
    '8th Grade',
    '9th Grade',
    '10th Grade - Scientific',
    '11th Grade - Scientific',
    '12th Grade - Scientific',
    '10th Grade - Literary',
    '11th Grade - Literary',
    '12th Grade - Literary',
    '10th Grade - Industrial',
    '11th Grade - Industrial',
    '12th Grade - Industrial',
    '10th Grade - Commercial',
    '11th Grade - Commercial',
    '12th Grade - Commercial',
    '10th Grade - Agricultural',
    '11th Grade - Agricultural',
    '12th Grade - Agricultural',
    '10th Grade - Sharia',
    '11th Grade - Sharia',
    '12th Grade - Sharia',
  ];

  for (const grade of gradeLevels) {
    const option = dropdownOptionRepo.create({
      name: grade,
      dropdown: gradeLevelDropdown,
      isActive: true,
    });
    await dropdownOptionRepo.save(option);
  }

  await categoryRepo.save({
    ...profileCategory,
    isDropdownCreationEnabled: false,
    isSubcategoryCreationEnabled: false,
  });
}
