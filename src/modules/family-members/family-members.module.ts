import { Module } from '@nestjs/common';
import { FamilyMember } from './entities/family-members.entity';
import { FamilyMembersController } from './controllers/family-members.controller';
import { FamilyMembersService } from './services/family-members.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamiliesModule } from '../families/families.module';
import { PersonsModule } from '../persons/persons.module';

@Module({
  imports: [TypeOrmModule.forFeature([FamilyMember]), FamiliesModule, PersonsModule],
  controllers: [FamilyMembersController],
  providers: [FamilyMembersService],
  exports: [FamilyMembersService],
})
export class FamilyMembersModule {}
