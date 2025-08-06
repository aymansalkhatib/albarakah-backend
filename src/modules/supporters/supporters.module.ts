import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supporter } from './entities/supporters.entity';
import { PersonsModule } from '../persons/persons.module';
import { FamilyMembersModule } from '../family-members/family-members.module';
import { SupporterChildSponsorship } from './entities/supporters-children.entity';
import { SupportersService } from './services/supporters.service';
import { SupporterChildSponsorshipService } from './services/supporter-child-sponsorship.service';
import { SupportersController } from './controllers/supporters.controller';
import { SupporterChildSponsorshipController } from './controllers/supporter-child-sponsorship.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Supporter, SupporterChildSponsorship]),
    PersonsModule,
    FamilyMembersModule,
  ],
  controllers: [SupportersController, SupporterChildSponsorshipController],
  providers: [SupportersService, SupporterChildSponsorshipService],
  exports: [SupportersService, SupporterChildSponsorshipService],
})
export class SupportersModule {}
