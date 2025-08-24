import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyRegistrationForm } from './entities/family-registration-form.entity';
import { FamilyRegistrationFormsService } from './services/family-registration-forms.service';
import { FamilyRegistrationFormsController } from './controllers/family-registration-forms.controller';
import { FamiliesModule } from '../families/families.module';
import { GuardiansModule } from '../guardians/guardians.module';
import { HousesModule } from '../houses/houses.module';
import { FamilyMembersModule } from '../family-members/family-members.module';

@Module({
  imports: [TypeOrmModule.forFeature([FamilyRegistrationForm]),
    FamiliesModule,
    GuardiansModule,
    HousesModule,
    FamilyMembersModule,
  ],
  controllers: [FamilyRegistrationFormsController],
  providers: [FamilyRegistrationFormsService],
  exports: [FamilyRegistrationFormsService],
})
export class FamilyRegistrationFormsModule {}
