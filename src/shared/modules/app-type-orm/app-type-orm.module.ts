import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentConfig } from '../app-config/env.schema';
import { Environment } from '../app-config/env.constant';
import { Client } from 'pg';
// Import all entities

import { BeneficiaryFamily } from '../../../modules/beneficiary-families/entities/beneficiary-families.entity';
import { FamilyIncome } from '../../../modules/beneficiary-families/entities/family-income.entity';
import { FamilyMember } from '../../../modules/beneficiary-families/entities/family-members.entity';
import { CallLog } from '../../../modules/call-logs/entities/call-log.entity';
import { DropdownCategory } from '../../../modules/dropdowns/entities/dropdown-category.entity';
import { DropdownOption } from '../../../modules/dropdowns/entities/dropdown-option.entity';
import { Dropdown } from '../../../modules/dropdowns/entities/dropdown.entity';
import { SelectedDropdownOption } from '../../../modules/dropdowns/entities/selected-dropdown-option.entity';
import { EmergencyAidRequest } from '../../../modules/emergency-aid/entities/emergency-aid-request.entity';
import { Employee } from '../../../modules/employees/entities/employee.entity';
import { FamilyNeed } from '../../../modules/family-needs/entities/family-need.entity';
import { FamilyRegistrationForm } from '../../../modules/family-registration-forms/entities/family-registration-form.entity';
import { Guardian } from '../../../modules/guardians/entities/guardian.entity';
import { House } from '../../../modules/houses/entities/house.entity';
import { Interview } from '../../../modules/interviews/entities/interview.entity';
import { Person } from '../../../modules/persons/entities/person.entity';
import { ReceivedAssistance } from '../../../modules/received-assistance/entities/received-assistance.entity';
import { RolePermission } from '../../../modules/roles/entities/role-permission.entity';
import { Role } from '../../../modules/roles/entities/roles.entity';
import { UserPermission } from '../../../modules/roles/entities/user-permission.entity';
import { Permission } from '../../../modules/roles/enums/permission.enum';
import { Supporter } from '../../../modules/supporters/entities/supporters.entity';
import { CourseBatch } from '../../../modules/training-courses/entities/course-batch.entity';
import { PersonCourseBatch } from '../../../modules/training-courses/entities/person-course-batch.entity';
import { TrainingCourse } from '../../../modules/training-courses/entities/training-course.entity';
import { SystemUser } from '../../../modules/system-users/entities/system-user.entity';
import { Visit } from '../../../modules/visits/entities/visit.entity';
import { Child } from '../../../modules/children/entities/children.entity';
import { SupporterChildSponsorship } from '../../../modules/supporters/entities/supporters-children.entity';
import { PermissionEntity } from '../../../modules/roles/entities/permissions.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      async useFactory(configService: ConfigService<EnvironmentConfig>) {
        await createDatabaseIfNotExists(configService); // 🛠 تأكد القاعدة موجودة قبل الاتصال

        const isDev = configService.get<string>('NODE_ENV') !== Environment.PRODUCTION;

        return {
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          port: parseInt(configService.get('POSTGRES_PORT'), 10),
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DATABASE'),
          entities: [
            SystemUser,
            Person,
            Guardian,
            Employee,
            BeneficiaryFamily,
            FamilyMember,
            FamilyIncome,
            Child,
            Supporter,
            SupporterChildSponsorship,
            Role,
            PermissionEntity,
            RolePermission,
            UserPermission,
            Dropdown,
            DropdownCategory,
            DropdownOption,
            SelectedDropdownOption,
            House,
            Visit,
            Interview,
            CallLog,
            EmergencyAidRequest,
            FamilyNeed,
            FamilyRegistrationForm,
            ReceivedAssistance,
            TrainingCourse,
            CourseBatch,
            PersonCourseBatch,
          ],

          ...(!isDev
            ? {
                ssl: {
                  rejectUnauthorized: false,
                },
              }
            : {}),

          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AppTypeOrmModule {}

async function createDatabaseIfNotExists(configService: ConfigService<EnvironmentConfig>) {
  const client = new Client({
    host: configService.get('POSTGRES_HOST'),
    port: parseInt(configService.get('POSTGRES_PORT'), 10),
    user: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: 'postgres',
  });

  try {
    await client.connect();

    const dbName = configService.get('POSTGRES_DATABASE');

    const result = await client.query(`SELECT 1
                                       FROM pg_database
                                       WHERE datname = '${dbName}'`);
    if (result.rowCount === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database "${dbName}" created successfully.`);
    } else {
      // console.log(`✅ Database "${dbName}" already exists.`);
    }
  } catch (error) {
    console.error('❌ Error creating database:', error);
  } finally {
    await client.end();
  }
}
