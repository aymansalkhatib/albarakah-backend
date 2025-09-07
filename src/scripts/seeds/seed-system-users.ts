import { ConfigService } from '@nestjs/config';
import { QueryRunner } from 'typeorm';
import { Employee } from '../../modules/employees/entities/employee.entity';
import { Person } from '../../modules/persons/entities/person.entity';
import { GenderType } from '../../modules/persons/enums/gender-type.enum';
import { Role } from '../../modules/roles/entities/roles.entity';
import { SystemUser } from '../../modules/system-users/entities/system-user.entity';
import { EnvironmentConfig } from '../../shared/modules/app-config/env.schema';

export async function seedSystemUsers(
  queryRunner: QueryRunner,
  configService?: ConfigService<EnvironmentConfig>,
) {
  const personRepo = queryRunner.manager.getRepository(Person);
  const employeeRepo = queryRunner.manager.getRepository(Employee);
  const systemUserRepo = queryRunner.manager.getRepository(SystemUser);
  const roleRepo = queryRunner.manager.getRepository(Role);

  const superAdminRole = await roleRepo.findOne({
    where: { name: 'Superadmin' },
  });
  if (!superAdminRole) {
    throw new Error(
      'Roles must be seeded before creating system users. Run permission seed first.',
    );
  }

  const superAdminPassword =
    configService?.get<string>('SUPER_ADMIN_PASSWORD') || 'Admin@12345';

  const usersData = [
    {
      person: {
        id: 1,
        fullName: 'أحمد خليل',
        phone: '0599123456',
        nationalId: '12345678901',
        birthDate: new Date('1985-06-20'),
        gender: GenderType.MALE,
        nationality: 'فلسطيني',
      },
      employee: {
        id: 1,
        position: 'مدير النظام',
        hireDate: new Date('2010-03-01'),
        terminationDate: null,
        notes: 'مسؤول عن إدارة النظام بالكامل',
      },
      systemUser: {
        id: 1,
        username: 'superadmin',
        password: superAdminPassword,
        roleId: superAdminRole.id,
      },
    },
  ];

  for (const userData of usersData) {
    const existingUser = await systemUserRepo.findOne({
      where: { username: userData.systemUser.username },
    });
    const existingPerson = await personRepo.findOne({
      where: { nationalId: userData.person.nationalId },
    });

    if (existingUser || existingPerson) {
      console.log(
        `❌ User ${userData.systemUser.username} or Person ${userData.person.nationalId} already exists`,
      );
      continue;
    }

    const savedPerson = await personRepo.save(
      personRepo.create(userData.person),
    );
    console.log('savedPerson', savedPerson);
    const savedEmployee = await employeeRepo.save(
      employeeRepo.create({ ...userData.employee, personId: savedPerson.id }),
    );
    console.log('savedEmployee', savedEmployee);
    await systemUserRepo.save(
      systemUserRepo.create({
        ...userData.systemUser,
        employeeId: savedEmployee.id,
      }),
    );
  }

  console.log('🎉 System users seeding completed successfully!');
}
