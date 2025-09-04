import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyMembersModule } from '../family-members/family-members.module';
import { PersonsModule } from '../persons/persons.module';
import { SupporterChildSponsorshipController } from './controllers/supporter-child-sponsorship.controller';
import { SupportersController } from './controllers/supporters.controller';
import { SupporterChildSponsorship } from './entities/supporters-children.entity';
import { Supporter } from './entities/supporters.entity';
import { SupporterChildSponsorshipService } from './services/supporter-child-sponsorship.service';
import { SupportersService } from './services/supporters.service';

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
