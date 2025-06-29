import { QueryRunner } from 'typeorm';
import { Person } from '../../modules/persons/entities/person.entity';
import { Employee } from '../../modules/employees/entities/employee.entity';
import { SystemUser } from '../../modules/system-users/entities/system-user.entity';
import { Role } from '../../modules/roles/entities/roles.entity';
import { GenderType } from '../../modules/persons/enums/gender-type.enum';

export async function seedSystemUsers(queryRunner: QueryRunner) {
  const personRepo = queryRunner.manager.getRepository(Person);
  const employeeRepo = queryRunner.manager.getRepository(Employee);
  const systemUserRepo = queryRunner.manager.getRepository(SystemUser);
  const roleRepo = queryRunner.manager.getRepository(Role);

  // Get existing roles (should be created by seed-roles-permissions.ts first)
  const adminRole = await roleRepo.findOne({ where: { name: 'admin' } });
  const superAdminRole = await roleRepo.findOne({ where: { name: 'superadmin' } });

  if (!adminRole || !superAdminRole) {
    throw new Error(
      'Roles must be seeded before creating system users. Run permission seed first.',
    );
  }

  // Define sample users data
  const usersData = [
    {
      person: {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@albarakah.org',
        phone: '+970591234567',
        nationalId: '123456789',
        birthDate: new Date('1990-01-15'),
        gender: GenderType.MALE,
        isPalestinian: true,
        address: 'Gaza City, Palestine',
        nationality: 'Palestinian',
      },
      employee: {
        position: 'System Administrator',
        hireDate: new Date('2024-01-01'),
        notes: 'Super administrator with full system access',
      },
      systemUser: {
        username: 'superadmin',
        password: 'SuperAdmin123!',
        role: superAdminRole,
      },
    },
  ];

  // Create users
  for (const userData of usersData) {
    // Check if user already exists
    const existingUser = await systemUserRepo.findOne({
      where: { username: userData.systemUser.username },
    });

    if (existingUser) {
      console.log(`User ${userData.systemUser.username} already exists, skipping...`);
      continue;
    }

    // Check if person with same national ID exists
    const existingPerson = await personRepo.findOne({
      where: { nationalId: userData.person.nationalId },
    });

    if (existingPerson) {
      console.log(
        `Person with national ID ${userData.person.nationalId} already exists, skipping...`,
      );
      continue;
    }

    // Create Person
    const person = personRepo.create(userData.person);
    const savedPerson = await personRepo.save(person);

    // Create Employee
    const employee = employeeRepo.create({
      ...userData.employee,
      personId: savedPerson.id,
    });
    const savedEmployee = await employeeRepo.save(employee);

    // Hash password and create SystemUser
    const systemUser = systemUserRepo.create({
      username: userData.systemUser.username,
      password: userData.systemUser.password,
      employeeId: savedEmployee.id,
      roleId: userData.systemUser.role.id,
    });
    await systemUserRepo.save(systemUser);

    console.log(`✅ Created system user: ${userData.systemUser.username}`);
  }
}
