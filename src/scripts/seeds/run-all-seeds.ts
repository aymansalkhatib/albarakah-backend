import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../../app.module';
import { EnvironmentConfig } from '../../shared/modules/app-config/env.schema';
import { seedEmployees } from './seed-employees';
import { seedFamilies } from './seed-families';
import { seedFamilyMembers } from './seed-family-members';
import { seedFamilyNeeds } from './seed-family-needs';
import { seedRolesAndPermissions } from './seed-roles-permissions';
import { seedSystemUsers } from './seed-system-users';

async function bootstrap() {
  const args = process.argv.slice(2);
  const runPermission = args.includes('permission');
  const runSystemUsers = args.includes('system-users');
  const runEmployees = args.includes('employees');
  const runFamilies = args.includes('families');
  const runFamilyMembers = args.includes('family-members');
  const runFamilyNeeds = args.includes('family-needs');
  const runAll = args.includes('all');

  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  const configService = app.get(ConfigService<EnvironmentConfig>);
  const queryRunner = dataSource.createQueryRunner();

  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    if (runPermission) {
      await seedRolesAndPermissions(queryRunner);
      console.log('✅ Roles & Permissions seeded');
    }
    if (runSystemUsers) {
      await seedSystemUsers(queryRunner, configService);
      console.log('✅ System Users seeded');
    }
    if (runEmployees) {
      await seedEmployees(queryRunner);
      console.log('✅ Employees seeded');
    }
    if (runFamilies) {
      await seedFamilies(queryRunner);
      console.log('✅ Families seeded');
    }
    if (runFamilyMembers) {
      await seedFamilyMembers(queryRunner);
      console.log('✅ Family members seeded');
    }
    if (runFamilyNeeds) {
      await seedFamilyNeeds(queryRunner);
      console.log('✅ Family needs seeded');
    }
    if (runAll) {
      await seedRolesAndPermissions(queryRunner);
      await seedSystemUsers(queryRunner, configService);
      await seedEmployees(queryRunner);
      await seedFamilies(queryRunner);
      await seedFamilyMembers(queryRunner);
      await seedFamilyNeeds(queryRunner);
      console.log('✅ All seeders ran');
    }

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('Error seeding:', error);
  } finally {
    await queryRunner.release();
    await app.close();
  }
}

bootstrap()
  .then(() => {
    console.log('✨ Seeder finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeder failed:', error.message);
    process.exit(1);
  });
