import { QueryRunner } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Person } from '../../modules/persons/entities/person.entity';
import { Employee } from '../../modules/employees/entities/employee.entity';
import { SystemUser } from '../../modules/system-users/entities/system-user.entity';
import { Role } from '../../modules/roles/entities/roles.entity';
import { GenderType } from '../../modules/persons/enums/gender-type.enum';
import { EnvironmentConfig } from '../../shared/modules/app-config/env.schema';

export async function seedSystemUsers(
  queryRunner: QueryRunner,
  configService?: ConfigService<EnvironmentConfig>,
) {
  console.log('👤 Starting system users seeding...');

  const personRepo = queryRunner.manager.getRepository(Person);
  const employeeRepo = queryRunner.manager.getRepository(Employee);
  const systemUserRepo = queryRunner.manager.getRepository(SystemUser);
  const roleRepo = queryRunner.manager.getRepository(Role);

  // Get existing roles (should be created by seed-roles-permissions.ts first)
  console.log('🔍 Looking for existing roles...');
  const adminRole = await roleRepo.findOne({ where: { name: 'admin' } });
  const superAdminRole = await roleRepo.findOne({ where: { name: 'superadmin' } });

  if (!adminRole || !superAdminRole) {
    console.log('❌ Required roles not found!');
    throw new Error(
      'Roles must be seeded before creating system users. Run permission seed first.',
    );
  }
  console.log('✅ Found required roles: admin and superadmin');

  // Get super admin password from environment
  console.log('🔐 Getting super admin password from environment...');
  const superAdminPassword = configService?.get<string>('SUPER_ADMIN_PASSWORD');
  if (superAdminPassword) {
    console.log('✅ Super admin password loaded from environment');
  } else {
    console.log('⚠️ Super admin password not found in environment');
  }

  // Define sample users data
  console.log('📋 Preparing user data...');
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
        password: superAdminPassword,
        role: superAdminRole,
      },
    },
  ];
  console.log(`📊 Prepared ${usersData.length} user(s) for creation`);

  // Create users
  console.log('🚀 Starting user creation process...');
  let createdUsers = 0;
  let skippedUsers = 0;

  for (const userData of usersData) {
    console.log(`👀 Processing user: ${userData.systemUser.username}`);

    // Check if user already exists
    const existingUser = await systemUserRepo.findOne({
      where: { username: userData.systemUser.username },
    });

    if (existingUser) {
      console.log(`⏭️ User ${userData.systemUser.username} already exists, skipping...`);
      skippedUsers++;
      continue;
    }

    // Check if person with same national ID exists
    const existingPerson = await personRepo.findOne({
      where: { nationalId: userData.person.nationalId },
    });

    if (existingPerson) {
      console.log(
        `⏭️ Person with national ID ${userData.person.nationalId} already exists, skipping...`,
      );
      skippedUsers++;
      continue;
    }

    // Create Person
    console.log(`👥 Creating person: ${userData.person.firstName} ${userData.person.lastName}`);
    const person = personRepo.create(userData.person);
    const savedPerson = await personRepo.save(person);
    console.log(`✅ Person created with ID: ${savedPerson.id}`);

    // Create Employee
    console.log(`💼 Creating employee: ${userData.employee.position}`);
    const employee = employeeRepo.create({
      ...userData.employee,
      personId: savedPerson.id,
    });
    const savedEmployee = await employeeRepo.save(employee);
    console.log(`✅ Employee created with ID: ${savedEmployee.id}`);

    // Hash password and create SystemUser
    console.log(`🔐 Creating system user: ${userData.systemUser.username}`);
    const systemUser = systemUserRepo.create({
      username: userData.systemUser.username,
      password: userData.systemUser.password,
      employeeId: savedEmployee.id,
      roleId: userData.systemUser.role.id,
    });
    await systemUserRepo.save(systemUser);

    console.log(`✅ Created system user: ${userData.systemUser.username}`);
    createdUsers++;
  }

  console.log('📊 System users seeding summary:');
  console.log(`   ✅ Created users: ${createdUsers}`);
  console.log(`   ⏭️ Skipped users: ${skippedUsers}`);
  console.log('🎉 System users seeding completed!');
}
