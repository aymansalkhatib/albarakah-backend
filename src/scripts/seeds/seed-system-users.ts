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
    configService?.get<string>('SUPER_ADMIN_PASSWORD') || 'defaultPassword';

  const usersData = [
    {
      person: {
        fullName: 'Super Admin',
        phone: '0959123456',
        nationalId: '123456789',
        birthDate: new Date('1990-01-15'),
        gender: GenderType.MALE,
        nationality: 'Palestinian',
      },
      employee: { position: 'System Administrator' },
      systemUser: {
        username: 'Superadmin',
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

    if (existingUser || existingPerson) continue;

    const savedPerson = await personRepo.save(
      personRepo.create(userData.person),
    );
    const savedEmployee = await employeeRepo.save(
      employeeRepo.create({ ...userData.employee, personId: savedPerson.id }),
    );
    await systemUserRepo.save(
      systemUserRepo.create({
        username: userData.systemUser.username,
        password: userData.systemUser.password,
        employeeId: savedEmployee.id,
        roleId: userData.systemUser.roleId,
      }),
    );
  }

  console.log('🎉 System users seeding completed successfully!');
}
