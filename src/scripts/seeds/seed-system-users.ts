import { QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
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
    {
      person: {
        firstName: 'Ahmad',
        lastName: 'Al-Mahmoud',
        email: 'ahmad.admin@albarakah.org',
        phone: '+970592345678',
        nationalId: '987654321',
        birthDate: new Date('1985-03-20'),
        gender: GenderType.MALE,
        isPalestinian: true,
        address: 'Khan Younis, Gaza',
        nationality: 'Palestinian',
      },
      employee: {
        position: 'Program Administrator',
        hireDate: new Date('2024-01-15'),
        notes: 'Administrator for charity programs',
      },
      systemUser: {
        username: 'ahmad.admin',
        password: 'AdminPass123!',
        role: adminRole,
      },
    },
    {
      person: {
        firstName: 'Fatima',
        lastName: 'Al-Zahra',
        email: 'fatima.admin@albarakah.org',
        phone: '+970593456789',
        nationalId: '456789123',
        birthDate: new Date('1992-07-10'),
        gender: GenderType.FEMALE,
        isPalestinian: true,
        address: 'Rafah, Gaza',
        nationality: 'Palestinian',
      },
      employee: {
        position: 'Social Worker Administrator',
        hireDate: new Date('2024-02-01'),
        notes: 'Administrator specializing in family support programs',
      },
      systemUser: {
        username: 'fatima.admin',
        password: 'AdminPass123!',
        role: adminRole,
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
    const hashedPassword = await bcrypt.hash(userData.systemUser.password, 10);
    const systemUser = systemUserRepo.create({
      username: userData.systemUser.username,
      password: hashedPassword,
      employeeId: savedEmployee.id,
      roleId: userData.systemUser.role.id,
    });
    await systemUserRepo.save(systemUser);

    console.log(`✅ Created system user: ${userData.systemUser.username}`);
  }
}
