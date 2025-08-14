import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyRegistrationForm } from './entities/family-registration-form.entity';
import { FamilyRegistrationFormsService } from './services/family-registration-forms.service';
import { FamilyRegistrationFormsController } from './controllers/family-registration-forms.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FamilyRegistrationForm])],
  controllers: [FamilyRegistrationFormsController],
  providers: [FamilyRegistrationFormsService],
  exports: [FamilyRegistrationFormsService],
})
export class FamilyRegistrationFormsModule {}
