import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from '../employees/employee.module';
import { Family } from '../families/entities/families.entity';
import { FamiliesModule } from '../families/families.module';
import { FamilyMember } from '../family-members/entities/family-members.entity';
import { FamilyMembersModule } from '../family-members/family-members.module';
import { Person } from '../persons/entities/person.entity';
import { PersonsModule } from '../persons/persons.module';
import { InterviewController } from './controllers/interview.controller';
import { InterviewService } from './services/interview.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Family, FamilyMember, Person]),
    FamiliesModule,
    FamilyMembersModule,
    PersonsModule,
    EmployeesModule,
  ],
  controllers: [InterviewController],
  providers: [InterviewService],
  exports: [InterviewService],
})
export class InterviewModule {}
