import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingCourse } from './entities/training-course.entity';
import { CourseBatch } from './entities/course-batch.entity';
import { PersonCourseBatch } from './entities/person-course-batch.entity';
import { TrainingCoursesService } from './services/training-courses.service';
import { CourseBatchService } from './services/course-batch.service';
import { PersonCourseBatchService } from './services/person-course-batch.service';
import { TrainingCoursesController } from './controllers/training-courses.controller';
import { CourseBatchController } from './controllers/course-batch.controller';
import { PersonCourseBatchController } from './controllers/person-course-batch.controller';
import { FamilyMembersModule } from '../family-members/family-members.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrainingCourse, CourseBatch, PersonCourseBatch]),
    FamilyMembersModule,
  ],
  controllers: [TrainingCoursesController, CourseBatchController, PersonCourseBatchController],
  providers: [TrainingCoursesService, CourseBatchService, PersonCourseBatchService],
  exports: [TrainingCoursesService, CourseBatchService, PersonCourseBatchService],
})
export class TrainingCoursesModule {}
